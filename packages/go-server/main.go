package main

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"sync"
	"time"

	"github.com/joho/godotenv"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"

	// "net/http"
	"github.com/0glabs/0g-storage-client/common/blockchain"
	"github.com/0glabs/0g-storage-client/contract"
	"github.com/0glabs/0g-storage-client/core"
	"github.com/0glabs/0g-storage-client/node"
	"github.com/0glabs/0g-storage-client/transfer"

	"github.com/sirupsen/logrus"
	// "github.com/0glabs/0g-storage-client/core"
	// "github.com/0glabs/0g-storage-client/transfer"
	// "github.com/0glabs/0g-storage-client/core"
)

type uploadArgs struct {
	file string
	tags string
	url string
	contract string
	key string
	force bool
	taskSize uint
}

type downloadArgs struct {
	root  string
	file  string
	proof bool
	nodes []string
}

// LogBuffer is a thread-safe buffer to capture logs
type LogBuffer struct {
	sync.Mutex
	buf *bytes.Buffer
}

func NewLogBuffer() *LogBuffer {
	return &LogBuffer{buf: new(bytes.Buffer)}
}

func (lb *LogBuffer) Write(p []byte) (n int, err error) {
	lb.Lock()
	defer lb.Unlock()
	return lb.buf.Write(p)
}

func (lb *LogBuffer) String() string {
	lb.Lock()
	defer lb.Unlock()
	return lb.buf.String()
}

var logBuffer = NewLogBuffer()

func init() {
	logrus.SetOutput(logBuffer)
	logrus.SetFormatter(&logrus.TextFormatter{
		DisableColors: true,
		FullTimestamp: true,
	})
}

// ParseLastRootHash parses the last root hash from the logs
func ParseLastRootHash(logs string) string {
	lines := strings.Split(logs, "\n")
	rootHashPattern := regexp.MustCompile(`root=0x[0-9a-fA-F]+`)
	var lastRootHash string

	for _, line := range lines {
		if rootHashPattern.MatchString(line) {
			matches := rootHashPattern.FindStringSubmatch(line)
			if len(matches) > 0 {
				lastRootHash = matches[0]
			}
		}
	}

	return lastRootHash
}

func getLastRootHash() string {
	logs := logBuffer.String()
	lastRootHash := ParseLastRootHash(logs)
	return lastRootHash
}



func main() {
	// client := connect()

	// uploadFile(client)

    // http.HandleFunc("/upload", corsMiddleware(uploadHandler))
	http.HandleFunc("/download", corsMiddleware(downloadHandler))


    fmt.Println("Starting server on :8080")
    if err := http.ListenAndServe(":8080", nil); err != nil {
        fmt.Println("Error starting server:", err)
    }


	// download()

	// fmt.Println("Starting server...")
	// http.HandleFunc("/", handler)
	// http.ListenAndServe(":8080", nil)
}


func uploadHandler(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
        http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
        return
    }

    file, _, err := r.FormFile("file")
    if err != nil {
        http.Error(w, "Error retrieving the file", http.StatusBadRequest)
        return
    }
    defer file.Close()

    tempFile, err := os.CreateTemp("", "upload-*.tmp")
    if err != nil {
        http.Error(w, "Error creating temp file", http.StatusInternalServerError)
        return
    }
    defer tempFile.Close()

    _, err = file.Seek(0, 0)
    if err != nil {
        http.Error(w, "Error reading the file", http.StatusInternalServerError)
        return
    }

    _, err = tempFile.ReadFrom(file)
    if err != nil {
        http.Error(w, "Error saving the file", http.StatusInternalServerError)
        return
    }

    client := connect()
    if client == nil {
        http.Error(w, "Error connecting to storage client", http.StatusInternalServerError)
        return
    }

	fmt.Println(tempFile, "saf")
	fmt.Println(tempFile.Name(), "asfa")


    uploadFile(client, tempFile.Name())

	str := getLastRootHash()
	// fmt.Println(str, "STR")

	w.Write([]byte("File uploaded successfully: " + str))
}

func downloadHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("GET params were:", r.URL.Query().Get("root"))

	rootHash := r.URL.Query().Get("root")
	if rootHash == "" {
		http.Error(w, "Missing root hash parameter", http.StatusBadRequest)
		return
	}

	filename, err := downloadFile(rootHash)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Open the file
	file, err := os.Open(filename)
	if err != nil {
		http.Error(w, "Failed to open file", http.StatusInternalServerError)
		return
	}
	defer file.Close()

	// Set content type and headers
	w.Header().Set("Content-Type", "application/octet-stream")
	w.Header().Set("Content-Disposition", "attachment; filename="+filepath.Base(filename))

	// Write file contents to response
	if _, err := io.Copy(w, file); err != nil {
		http.Error(w, "Failed to write file to response", http.StatusInternalServerError)
		return
	}
}

func connect() *node.Client {
	ip := "https://rpc-storage-testnet.0g.ai"

	client, err := node.NewClient(ip)
	if err != nil {
		fmt.Println(err)
		return nil
	}

	status, err := client.ZeroGStorage().GetStatus()
	if err != nil {
		fmt.Println(err)
		return nil
	}

	fmt.Println(status)

	return client
}

func uploadFile(client *node.Client, filePath string) {
	err := godotenv.Load()
	if err != nil {
		return
	}

	args := uploadArgs{
        file: filePath,
		tags: "0x",
		url: "https://rpc-testnet.0g.ai",
		contract: "0xb8F03061969da6Ad38f0a4a9f8a86bE71dA3c8E7",
		key: os.Getenv("PRIVATE_KEY"),
		force: false,
		taskSize: 10,
	}

	w3client := blockchain.MustNewWeb3(args.url, args.key)
	defer w3client.Close()

	contractAddr := common.HexToAddress(args.contract)

	flowContract, err := contract.NewFlowContract(contractAddr, w3client)
	if err != nil {
		return
	}

	uploader, err := transfer.NewUploader(flowContract, []*node.Client{client})
	if err != nil {
		return
	}

	opt := transfer.UploadOption{
		Tags: hexutil.MustDecode(args.tags),
		Force: args.force,
		TaskSize: args.taskSize,
	}

	file, err := core.Open(args.file)
	if err != nil {
		return
	}

	defer file.Close()
	errw := uploader.Upload(file, opt)
	if errw != nil {
		return
	}

	
	fmt.Println(errw, "HII")
	// if err := ; err != nil {
	// 	fmt.Println(err)
	// 	return
	// }

}
func generateUniqueFilename() string {
	timestamp := time.Now().Format("20060102150405")
	return fmt.Sprintf("./dir/icon_%s.tmp", timestamp)
}

func downloadFile(rootHash string) (string, error) {
	uniqueFilename := generateUniqueFilename()

	downloadArgs := downloadArgs{
		root:  rootHash,
		file:  uniqueFilename,
		proof: false,
		nodes: []string{"https://rpc-storage-testnet.0g.ai"},
	}

	// Initialize nodes
	nodes := node.MustNewClients(downloadArgs.nodes)
	for _, client := range nodes {
		defer client.Close()
	}

	// Create downloader
	downloader, err := transfer.NewDownloader(nodes...)
	if err != nil {
		return "", fmt.Errorf("failed to initialize downloader: %v", err)
	}

	// Perform download
	if err := downloader.Download(downloadArgs.root, downloadArgs.file, downloadArgs.proof); err != nil {
		return "", fmt.Errorf("failed to download file: %v", err)
	}

	return uniqueFilename, nil
}


func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

        if r.Method == http.MethodOptions {
            w.WriteHeader(http.StatusOK)
            return
        }

        next(w, r)
    }
}