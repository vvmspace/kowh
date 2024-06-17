import { privateRequest, publicRequest } from "../../utils/request";
import "./style.css";
import WebApp from "@twa-dev/sdk";
import { useEffect, useState } from "preact/hooks";

export function Home() {
  const [awakes, setAwakes] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [inviteMessage, setInviteMessage] = useState("Invite your friends to join the King of The Hill!");
  const [id, setId] = useState<string | null>(localStorage.getItem("id"));

  function handleInvite() {
		navigator.clipboard.writeText(`https://t.me/KingOfTheHillGameBot?start=${id}`);
		setInviteMessage("Copied to clipboard!");
		setTimeout(() => setInviteMessage("Invite your friends to join the King of The Hill!"), 3000);
	}

  useEffect(() => {
    (async () => {
      WebApp.ready();
      const data = WebApp.initData;
	  WebApp.CloudStorage.getItem("awakes", (err, value) => {
		setAwakes(value ? parseInt(value) : 0);
	  });
      if (data && !id) {
		const url = "/.netlify/functions/auth?" + data;
		const { auth_token } = (await publicRequest(url)).data;
		localStorage.setItem("authToken", auth_token);
		const meResponse = await privateRequest("/.netlify/functions/me", "GET", null);
		const id = meResponse.data.user.id;
		setId(id);
      }
	  setLoading(false);
    })();
  }, []);

  function WakeUpKing() {
	setAwakes(awakes + 1);
	WebApp.CloudStorage.setItem("awakes", `${awakes + 1}`);
  }

  return loading ? (
    <h1>loading...</h1>
  ) : (
    <div class="home">
      <h1>King of The Hill [Beta]</h1>
      <section>
        <Awaker
          awakes={awakes}
          title="Wake up the King"
          description="Nothing will be saved, but wake the King!!"
          onClick={WakeUpKing}
        />
		<Resource
		  title="Invite your friends"
		  description={inviteMessage}
		  description2={`Your link: https://t.me/KingOfTheHillGameBot?start=${id}`}
		  onClick={handleInvite}
		/>
      </section>
    </div>
  );
}

function Resource(props) {
	  return (
	<a
	  href={props.href}
	  target="_blank"
	  class="resource"
	  onClick={props.onClick}
	>
	  <h2>{props.title}</h2>
	  <p>{props.description}</p>
	  <p>{props.description2}</p>
	</a>
  );
}

function Awaker(props) {
  return (
    <a
      href={props.href}
      target="_blank"
      class="resource"
      onClick={props.onClick}
    >
      <h2>{props.title}</h2>
      <p>{props.description}</p>
      <p>Awakes: {props.awakes}</p>
    </a>
  );
}
