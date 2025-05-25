package handlers

import (
	"encoding/json"
	"logic-go/request"
	"logic-go/response"
	"net/http"
)

func Calculate(w http.ResponseWriter, r *http.Request) {
	var req request.CalculateRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	var priceToCalculate = req.OriginalPrice
	var discountCap float64
	var totalDiscount float64

	// find cap
	for _, discount := range req.Discounts {
		if discount.Type == "cap" {
			discountCap = *discount.MaxDiscount
		}
	}

	for _, discount := range req.Discounts {
		var discountAmount float64

		if discount.Type == "fixed" {
			discountAmount = *discount.Value
		}

		if discount.Type == "percentage" {
			discountAmount = priceToCalculate * (*discount.Value / 100)
		}

		if discount.Type == "conditional" {
			if req.OriginalPrice > *discount.Condition {
				discountAmount = *discount.Value
			}
		}

		if discount.Type == "tiered" {
			for _, tier := range *discount.Tiers {
				if req.OriginalPrice >= tier.Min && req.OriginalPrice <= tier.Max {
					discountAmount = tier.Value
				}
			}
		}

		priceToCalculate = priceToCalculate - discountAmount

		totalDiscount = totalDiscount + discountAmount

		if totalDiscount >= discountCap {
			priceToCalculate = req.OriginalPrice - discountCap
			break
		}
	}

	var res = response.Calculate{
		FinalPrice: priceToCalculate,
		// AppliedDiscounts: req.Discounts,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(res)
}
