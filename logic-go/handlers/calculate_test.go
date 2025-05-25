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

	Calculate(rec, req)

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

func TestCalculate_FixedDiscount(t *testing.T) {
	input := request.CalculateRequest{
		OriginalPrice: 100,
		Discounts: []request.DiscountsSubRequest{
			{Type: "fixed", Value: floatPtr(20)},
		},
	}

	expectFinalPrice(t, input, 80.0)
}

func TestCalculate_PercentageDiscount(t *testing.T) {
	input := request.CalculateRequest{
		OriginalPrice: 200,
		Discounts: []request.DiscountsSubRequest{
			{Type: "percentage", Value: floatPtr(10)},
		},
	}

	expectFinalPrice(t, input, 180.0)
}

func TestCalculate_ConditionalDiscount(t *testing.T) {
	input := request.CalculateRequest{
		OriginalPrice: 250,
		Discounts: []request.DiscountsSubRequest{
			{Type: "conditional", Condition: floatPtr(200), Value: floatPtr(15)},
		},
	}

	expectFinalPrice(t, input, 235.0)
}

func TestCalculate_TieredDiscount(t *testing.T) {
	input := request.CalculateRequest{
		OriginalPrice: 250,
		Discounts: []request.DiscountsSubRequest{
			{
				Type: "tiered",
				Tiers: &[]request.TiersSubRequest{
					{Min: 0, Max: 99, Value: 5},
					{Min: 100, Max: 199, Value: 10},
					{Min: 200, Max: 9999, Value: 25},
				},
			},
		},
	}

	expectFinalPrice(t, input, 225.0)
}

func TestCalculate_CapDiscount(t *testing.T) {
	input := request.CalculateRequest{
		OriginalPrice: 250,
		Discounts: []request.DiscountsSubRequest{
			{Type: "fixed", Value: floatPtr(20)},
			{Type: "percentage", Value: floatPtr(10)},
			{Type: "conditional", Condition: floatPtr(200), Value: floatPtr(15)},
			{
				Type: "tiered",
				Tiers: &[]request.TiersSubRequest{
					{Min: 0, Max: 99, Value: 5},
					{Min: 100, Max: 199, Value: 10},
					{Min: 200, Max: 9999, Value: 25},
				},
			},
			{Type: "cap", MaxDiscount: floatPtr(60)},
		},
	}

	expectFinalPrice(t, input, 190.0) // 250 - capped at 60
}

func expectFinalPrice(t *testing.T, input request.CalculateRequest, expected float64) {
	t.Helper()

	body, _ := json.Marshal(input)
	req := httptest.NewRequest(http.MethodPost, "/calculate", bytes.NewReader(body))
	rec := httptest.NewRecorder()

	Calculate(rec, req)

	res := rec.Result()
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		t.Fatalf("expected status 200, got %d", res.StatusCode)
	}

	var output struct {
		FinalPrice float64 `json:"finalPrice"`
	}
	if err := json.NewDecoder(res.Body).Decode(&output); err != nil {
		t.Fatalf("error decoding response: %v", err)
	}

	if output.FinalPrice != expected {
		t.Errorf("expected final price %.2f, got %.2f", expected, output.FinalPrice)
	}
}

func floatPtr(f float64) *float64 {
	return &f
}
