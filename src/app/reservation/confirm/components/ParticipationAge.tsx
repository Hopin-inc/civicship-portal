import { Textarea } from "@/components/ui/textarea";

interface CommentTextareaProps {
  title: string;
  description: string;
  placeholder: string;
  value: string | null;
  onChange: (value: string | null) => void;
}

export const CommentTextarea: React.FC<CommentTextareaProps> = ({
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
      <Textarea
        placeholder={placeholder}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        rows={4}
        className="min-h-[120px]"
      />
    </div>
  );
};
