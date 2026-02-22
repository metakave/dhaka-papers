package main

import (
	"context"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

func main() {
	accountId := "dd8670954263a64080507d148916289f"
	accessKey := "f2aeeb11c588970750d9acfaf8342e2e"
	secretKey := "db6d3c19d2840c7d8b3507a70f927ef3f640f8f1a1e4f5d14470cf224abcec3e"
	bucketName := "dhakapapers"

	r2Resolver := aws.EndpointResolverWithOptionsFunc(func(service, region string, options ...interface{}) (aws.Endpoint, error) {
		return aws.Endpoint{
			URL: fmt.Sprintf("https://%s.r2.cloudflarestorage.com", accountId),
		}, nil
	})

	cfg, err := config.LoadDefaultConfig(context.TODO(),
		config.WithEndpointResolverWithOptions(r2Resolver),
		config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(accessKey, secretKey, "")),
		config.WithRegion("auto"),
	)
	if err != nil {
		log.Fatal(err)
	}

	client := s3.NewFromConfig(cfg)

	uploadDir(client, bucketName, "/Users/musfiqurtuhin/Downloads/Extrajudicial Killing/images", "special-reports/extrajudicial-killing/images", ".jpg")
	uploadDir(client, bucketName, "/Users/musfiqurtuhin/Downloads/Extrajudicial Killing/QR Codes", "special-reports/extrajudicial-killing/qrcodes", ".png")
}

func uploadDir(client *s3.Client, bucketName, localDir, targetPrefix, forceExt string) {
	files, err := ioutil.ReadDir(localDir)
	if err != nil {
		log.Printf("Failed to read dir %s: %v", localDir, err)
		return
	}

	for _, file := range files {
		if file.IsDir() || file.Name() == ".DS_Store" {
			continue
		}

		filePath := filepath.Join(localDir, file.Name())
		fileBody, err := os.Open(filePath)
		if err != nil {
			log.Printf("Failed to open %s: %v", filePath, err)
			continue
		}

		ext := strings.ToLower(filepath.Ext(file.Name()))
		contentType := "application/octet-stream"
		if ext == ".png" {
			contentType = "image/png"
		} else if ext == ".jpg" || ext == ".jpeg" {
			contentType = "image/jpeg"
		}

		// Force the key name to match our DB expectations
		baseName := strings.TrimSuffix(file.Name(), filepath.Ext(file.Name()))
		targetKey := fmt.Sprintf("%s/%s%s", targetPrefix, baseName, forceExt)

		_, err = client.PutObject(context.TODO(), &s3.PutObjectInput{
			Bucket:      aws.String(bucketName),
			Key:         aws.String(targetKey),
			Body:        fileBody,
			ContentType: aws.String(contentType),
		})

		fileBody.Close()

		if err != nil {
			log.Printf("Failed to upload %s: %v", file.Name(), err)
		} else {
			log.Printf("Uploaded %s to %s", file.Name(), targetKey)
		}
	}
}
