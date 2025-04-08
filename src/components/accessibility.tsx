const RatingStars: React.FC<{ rating: number }> = ({ rating }) => {
    return (
        <div className="rating-container" role="group" aria-label="Exercise Rating">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    aria-label={`Rate ${star} out of 5 stars`}
                    aria-pressed={rating >= star}
                    onClick={() => handleRating(star)}
                    className={`star ${rating >= star ? 'active' : ''}`}
                >
                    ⭐
                </button>
            ))}
        </div>
    );
};