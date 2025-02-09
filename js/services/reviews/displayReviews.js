import { Button } from "../../components/base/Button.js";
import { createElement } from "../../components/createElement.js";
import { apiFetch } from "../../api/api.js";

// Create a review item component
function ReviewItem(isCreator, { reviewerName, rating, comment, onEdit, onDelete }) {
    let actions;
    if (!isCreator) {
        actions = createElement("div", { class: "review-actions" }, [
            Button("Edit", "edit-review-btn", { click: onEdit }),
            Button("Delete", "delete-review-btn", { click: onDelete }),
        ]);
    } else {
        actions = null;
    }
    console.log(isCreator);
    return createElement("div", { class: "review-item" }, [
        createElement("h3", {}, [reviewerName]),
        createElement("p", {}, [`Ratings: ${rating}`]),
        createElement("p", {}, [comment]),
        ...(actions ? [actions] : []), // Spread operator to add `actions` if not null
    ]);

}

// Display reviews for the given entity
async function displayReviews(isCreator, isLoggedIn, reviewsContainer, entityType, entityId) {
    reviewsContainer.innerHTML = ""; // Clear existing reviews

    if (!isCreator && isLoggedIn) {
        const addButton = Button("Add Review", "add-review-btn", {
            click: () => handleAddReview(entityType, entityId),
        });
        reviewsContainer.appendChild(addButton);
    }

    try {
        const response = await apiFetch(`/reviews/${entityType}/${entityId}`);
        if (response.ok) {
            const { reviews } = await response;
            if (reviews && reviews.length > 0) {
                reviews.forEach((review) => {
                    reviewsContainer.appendChild(
                        ReviewItem(isCreator, {
                            reviewerName: review.userid ? review.userid : "Anonymous",
                            rating: review.rating,
                            comment: review.comment,
                            date: new Date(review.date).toLocaleString(),
                            onEdit: () => handleEditReview(review.reviewid, entityType, entityId),
                            onDelete: () => handleDeleteReview(review.reviewid, entityType, entityId),
                        })
                    );
                });
            } else {
                reviewsContainer.appendChild(createElement("p", {}, ["No reviews yet."]));
            }
        } else {
            throw new Error(`API error: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error fetching reviews:", error);
        reviewsContainer.appendChild(createElement("p", {}, ["Failed to load reviews."]));
    }

}

// Handle adding a new review
async function handleAddReview(entityType, entityId) {
    const rating = parseInt(prompt("Enter a rating (1-5):"), 10);
    const comment = prompt("Enter your review:");

    if (rating && comment && rating >= 1 && rating <= 5) {
        try {
            await apiFetch(
                `/reviews/${entityType}/${entityId}`,
                "POST",
                JSON.stringify({ rating, comment })
            );
            alert("Review added successfully!");
            refreshReviews(); // Reload reviews
        } catch (error) {
            console.error("Error adding review:", error);
            alert("Failed to add review. You might have already reviewed this entity.");
        }
    } else {
        alert("Invalid input. Rating must be between 1-5, and comment cannot be empty.");
    }
}

async function refreshReviews() {
    await displayReviews(isCreator, isLoggedIn, reviewsContainer, entityType, entityId);
}

// Handle editing a review
async function handleEditReview(reviewId, entityType, entityId) {
    const newRating = parseInt(prompt("Enter a new rating (1-5):"), 10);
    const newComment = prompt("Enter a new comment:");

    if (newRating && newComment && newRating >= 1 && newRating <= 5) {
        try {
            await apiFetch(
                `/reviews/${entityType}/${entityId}/${reviewId}`,
                "PUT",
                JSON.stringify({ rating: newRating, comment: newComment })
            );
            alert("Review updated successfully!");
            refreshReviews(); // Reload reviews
        } catch (error) {
            console.error("Error editing review:", error);
            alert("Failed to update review.");
        }
    } else {
        alert("Invalid input. Rating must be between 1-5, and comment cannot be empty.");
    }
}

// Handle deleting a review
async function handleDeleteReview(reviewId, entityType, entityId) {
    if (confirm("Are you sure you want to delete this review?")) {
        try {
            await apiFetch(`/reviews/${entityType}/${entityId}/${reviewId}`, "DELETE");
            alert("Review deleted successfully!");
            refreshReviews(); // Reload reviews
        } catch (error) {
            console.error("Error deleting review:", error);
            alert("Failed to delete review.");
        }
    }
}

export { displayReviews };
