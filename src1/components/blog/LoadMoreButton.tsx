// src/components/blog/LoadMoreButton.tsx
interface LoadMoreButtonProps {
    onClick: () => void;
    disabled: boolean;
  }
  
  export default function LoadMoreButton({
    onClick,
    disabled,
  }: LoadMoreButtonProps) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className="btn btn-primary mt-8 w-full disabled:opacity-50"
      >
        {disabled ? "No More Posts" : "Load More"}
      </button>
    );
  }
  