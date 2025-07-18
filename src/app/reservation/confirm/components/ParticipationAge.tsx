import { Input } from "@/components/ui/input";

interface CommentInputProps {
  title: string;
  description: string;
  placeholder: string;
  value: string | null;
  onChange: (value: string | null) => void;
}

export const CommentInput: React.FC<CommentInputProps> = ({
  title,
  description,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <div className="px-6 py-2">
      <h2 className="text-display-sm mb-1">{title}</h2>
      <p className="text-body-sm text-caption mb-4">{description}</p>
      <Input
        placeholder={placeholder}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
      />
    </div>
  );
};
