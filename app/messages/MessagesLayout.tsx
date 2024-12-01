export default function MessagesLayout({
    children,
}: {
    children?: React.ReactNode;
}) {
    return (
        <main className="flex w-full bg-white">
            {children ? <div className="flex-1">{children}</div> : null}
        </main>
    );
}
