import { useLocation } from "preact-iso";

export function Footer() {
  const { url } = useLocation();

  return (
    <footer>
      <nav>
        <a href="/" class={url == "/" && "active"}>
          Home
        </a>
        <a href="https://t.me/c/2165342026/5" class={url == "/invite" && "active"}>
          Roadmap
        </a>
        <a href="/tasks" target="_blank" class={url == "/tasks" && "active"}>
          Tasks
        </a>
        <a href="/top" class={url == "/top" && "active"}>
          Top
        </a>
        <a href="/friends" class={url == "/friends" && "active"}>
          Friends
        </a>
      </nav>
    </footer>
  );
}
