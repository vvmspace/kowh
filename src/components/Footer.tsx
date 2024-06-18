import { useLocation } from "preact-iso";

export function Footer() {
  const { url } = useLocation();

  return (
    <footer>
      <nav>
        <a href="/" class={url == "/" && "active"}>
          Home
        </a>
        <a href="/invite" class={url == "/invite" && "active"}>
          Tasks
        </a>
        <a href="/invite" class={url == "/invite" && "active"}>
          Top
        </a>
        <a href="/invite" class={url == "/invite" && "active"}>
          Friends
        </a>
      </nav>
    </footer>
  );
}
