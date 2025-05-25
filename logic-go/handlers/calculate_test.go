package handlers

import (
	"bytes"
	"encoding/json"
	"io"
	"logic-go/request"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestCalculateHandler(t *testing.T) {
	// Construct the input request
	input := request.CalculateRequest{
		OriginalPrice: 100,
		Discounts: []request.DiscountsSubRequest{
			{Type: "fixed", Value: floatPtr(10)},
			{Type: "percentage", Value: floatPtr(10)},
		},
	}

	body, _ := json.Marshal(input)
	req := httptest.NewRequest(http.MethodPost, "/calculate", bytes.NewReader(body))
	rec := httptest.NewRecorder()

	// Call the handler
	Calculate(rec, req)

	// Read and parse the response
	res := rec.Result()
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		t.Fatalf("expected status 200, got %d", res.StatusCode)
	}

	data, _ := io.ReadAll(res.Body)

	var output struct {
		FinalPrice float64 `json:"finalPrice"`
	}

	err := json.Unmarshal(data, &output)
	if err != nil {
		t.Fatalf("error decoding response: %v", err)
	}

	expected := 81.0
	if output.FinalPrice != expected {
		t.Errorf("expected final price %.2f, got %.2f", expected, output.FinalPrice)
	}
}

func floatPtr(f float64) *float64 {
	return &f
}
