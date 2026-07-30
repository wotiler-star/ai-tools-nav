export default function SectionTitle({
  title,
  extra
}: {
  title: string;
  extra?: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        margin: "8px 0 16px"
      }}
    >
      <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>{title}</h2>
      {extra}
    </div>
  );
}
