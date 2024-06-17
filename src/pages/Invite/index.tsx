import { useEffect, useState } from "preact/hooks";
import "./style.css";
import { privateRequest } from "../../utils/request";
import { lazy } from "preact-iso";

const [id, setId] = useState<string | null>(localStorage.getItem("id"));
const [message, setMessage] = useState<string>("Invite your friends to join the King of The Hill!");


export function Invite() {
    lazy(async () => {
            if (!id) {
                const meResponse = await privateRequest("/.netlify/functions/me", "GET", null);
                const id = meResponse.data.user.id;
                setId(id);
            }
        });
    function handleClick() {
        navigator.clipboard.writeText(`https://t.me/KingOfTheHillGameBot?start=${id}`);
        setMessage("Copied to clipboard!");
        setTimeout(() => setMessage("Invite your friends to join the King of The Hill!"), 3000);
    }
      return (
    <div class="invite" onClick={handleClick}>
      <h1>Invite</h1>
      <section>
        <p>{ message }</p>
        <p>Your link: https://t.me/KingOfTheHillGameBot?start={id}</p>
      </section>
    </div>
  );
}