package main

import (
	"bytes"
	"fmt"
	"net/http"
	"os"
	"regexp"
	"strings"
	"sync"

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

    http.HandleFunc("/upload", corsMiddleware(uploadHandler))

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

func download() {
	downloadArgs := downloadArgs{
		root:  "0x9124ef3c4925165f47cdaf186f896597d769bb19e5b159bbb23e5fa778d52af0",
		file:  "./dir/icon3.tmp",
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
		fmt.Println("Failed to initialize downloader")
	}

	// Perform download
	if err := downloader.Download(downloadArgs.root, downloadArgs.file, downloadArgs.proof); err != nil {
		fmt.Println("Failed to download file", err)
	}
}


func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

        if r.Method == http.MethodOptions {
            w.WriteHeader(http.StatusOK)
            return
        }

        next(w, r)
    }
}
