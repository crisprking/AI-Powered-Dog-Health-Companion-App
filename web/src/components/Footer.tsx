export function Footer() {
  return (
    <footer className="border-t border-white/10 py-10 text-center text-sm text-white/60">
      <div className="mx-auto max-w-6xl px-6">
        <p>
          © {new Date().getFullYear()} Game Blitz. Built with Next.js.
        </p>
        <div className="mt-2 flex justify-center gap-4">
          <a className="hover:text-white" href="#">Twitter</a>
          <a className="hover:text-white" href="#">Discord</a>
          <a className="hover:text-white" href="#">GitHub</a>
        </div>
      </div>
    </footer>
  );
}








