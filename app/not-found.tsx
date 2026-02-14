import Link from "next/link";

export default function NotFound() {
    return (
        <div className="container mx-auto px-4 py-24">
            <div className="max-w-2xl mx-auto text-center">
                <h1 className="text-9xl font-bold gradient-text mb-4">404</h1>
                <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
                <p className="text-muted-foreground mb-8">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-8 py-3 font-medium hover:bg-primary/90 transition-smooth neon-glow"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    )
}
