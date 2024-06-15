package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/joho/godotenv"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"

	// "net/http"
	"github.com/0glabs/0g-storage-client/common/blockchain"
	"github.com/0glabs/0g-storage-client/contract"
	"github.com/0glabs/0g-storage-client/core"
	"github.com/0glabs/0g-storage-client/node"
	"github.com/0glabs/0g-storage-client/transfer"
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

func main() {
	client := connect()

	uploadFile(client)
	// fmt.Println("Starting server...")
	// http.HandleFunc("/", handler)
	// http.ListenAndServe(":8080", nil)
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

func uploadFile(client *node.Client) {
	err := godotenv.Load()
	if err != nil {
		return
	}

	args := uploadArgs{
		file: "test.txt",
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

	if err := uploader.Upload(file, opt); err != nil {
		fmt.Println(err)
		return
	}

}


func handler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hello from Go server!")
}

