export default function Stars({ rating, size = 18, interactive = false, onChange }) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <span
                key={i}
                className={`star ${i <= rating ? 'filled' : ''} ${interactive ? 'clickable' : ''}`}
                style={{ fontSize: size }}
                onClick={() => interactive && onChange && onChange(i)}
            >
                ★
            </span>
        );
    }
    return <span className="stars">{stars}</span>;
}
