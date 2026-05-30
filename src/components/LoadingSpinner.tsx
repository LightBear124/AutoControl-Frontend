type LoadingSpinnerProps = {
  text?: string;
};

export default function LoadingSpinner({
  text = 'Загрузка данных...',
}: LoadingSpinnerProps) {
  return (
    <div className="loading-block">
      <div className="loading-spinner" />
      <span>{text}</span>
    </div>
  );
}