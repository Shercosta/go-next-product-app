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
	var discountCap *float64
	var totalDiscount float64

	var res = response.Calculate{}

	// find cap
	for _, discount := range req.Discounts {
		if discount.Type == "cap" {
			discountCap = discount.MaxDiscount
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

		res.AppliedDiscounts = append(res.AppliedDiscounts, response.DiscountsSubResponse{
			Type: discount.Type,
			Amount: func() *float64 {
				if discount.Type != "cap" {
					return &discountAmount
				}
				return nil
			}(),
			OriginalDiscountTotal: func() *float64 {
				if discount.Type == "cap" {
					return &totalDiscount
				}
				return nil
			}(),
			CappedAt: func() *float64 {
				if discount.Type == "cap" {
					return discountCap
				}
				return nil
			}(),
		})

		if discountCap != nil {
			if totalDiscount >= *discountCap {
				priceToCalculate = req.OriginalPrice - *discountCap
				// break
			}
		}
	}

	res.FinalPrice = priceToCalculate

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(res)
}
