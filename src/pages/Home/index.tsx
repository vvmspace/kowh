import { getMe } from "../../api/auth";
import { awake, getTop, useCoffee, useSandwich } from "../../api/game";
import { FoodCard } from "../../components/FoodCart";
import { MsToTime } from "../../components/MsToTime";
import { privateRequest, publicRequest } from "../../utils/request";
import "./style.css";
import WebApp from "@twa-dev/sdk";
import { useEffect, useState } from "preact/hooks";

const sms = 1000;
const mms = 60 * sms;
const hms = 60 * mms;
const dms = 24 * hms;

const ddiff = (t1: Date, t2: Date = new Date()) => t1.getTime() - t2.getTime();

export function Home() {
  const [steps, setSteps] = useState<number>(0);
  const [coffees, setCoffees] = useState<number>(0);
  const [sandwiches, setSandwiches] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [inviteMessage, setInviteMessage] = useState("");
  const [id, setId] = useState<string | null>(localStorage.getItem("id"));
  const [awakable, setAwakable] = useState<boolean>(false);
  const [nextAwake, setNextAwake] = useState<Date | null>(new Date(Date.now() + 3600000));
  const [timeLeft, setTimeLeft] = useState<number>(3600000);
  const [top, setTop] = useState<any[]>([]);
  const isLocal = location.hostname === "localhost";
  const [king, setKing] = useState<any>({});
  const [easterTaps, setEasterTaps] = useState(7);
  const [lastBonus, setLastBonus] = useState<Date | null>(null);

  const updateKing = async () => {
    const { user: king, nextAwake } = await getMe();
    setKing(king);
    setInviteMessage(`https://t.me/KingOfTheHillGameBot?start=${king.telegramId}`)
    setId(king.telegramId);
    setSteps(king.steps);
    setCoffees(king.coffees);
    setSandwiches(king.sandwiches);
    setLastBonus(king.lastBonus ? new Date(king.lastBonus) : null);
    setNextAwake(nextAwake);
  };

  function handleInvite() {
    navigator.clipboard.writeText(
      `https://t.me/KingOfTheHillGameBot?start=${id}`,
    );
    navigator.share({
      title: "King of The Hill",
      text: "Join the game",
      url: `https://t.me/KingOfTheHillGameBot?start=${id}`,
    });
    setInviteMessage(`https://t.me/KingOfTheHillGameBot?start=${id} (Copied)`);
    setTimeout(
      () =>
        setInviteMessage(`https://t.me/KingOfTheHillGameBot?start=${id}`),
      3000,
    );
  }

  useEffect(() => {
    (async () => {
      WebApp.ready();
      setLoading(false);
      await getTop().then((res) => {
        console.log(res);
        return setTop(res);
      });
      await updateKing();
    })();
  }, []);

  setInterval(() => {
    const now = new Date();
    const end = new Date(nextAwake);
    const diff = end.getTime() - now.getTime();
    setAwakable(diff <= 0);
    setTimeLeft(diff);
  }, 1000);

  const WakeUpKing = async () => {
    if (!awakable) return;

    setAwakable(false);
    setTimeLeft(3600000);
    const { nextAwake } = await awake();
    setNextAwake(nextAwake);
    await updateKing();
  };

  function maskUsername(name) {
      if (!isNaN(parseInt(name))) {
        return '***' + name.slice(-4);
      }

      return name.slice(0, 3) + '***';
  }
  

  return loading ? (
    <h1>loading...</h1>
  ) : (
    <div class="home">
      <h1>King of The Hill [Beta]</h1>
      <p>We are working on this game. Just enjoy!</p>
      <section>
        <a target="_blank" class="resource" onClick={WakeUpKing}>
          <h2>
            {awakable ? "Wake up the King" : "The King is climbing"}
          </h2>
          <p>
            After every awake the King makes 10 steps and gets 1 coffee and 1
            sandwich.
          </p>
          <p>
            Steps: <b>{steps}</b>
          </p>
          <p class={"tap" + (awakable && " active" || "")}>
            {(awakable && <>Tap me</>) || <MsToTime timeLeft={timeLeft} />}
          </p>
        </a>
        <div class="cards">
        {(sandwiches > 0 || isLocal) && (
          <FoodCard
            icon="🥪"
            title="Sandwich"
            count={sandwiches}
            steps={3}
            onClick={() => useSandwich().then(updateKing)}
          />
        )}
        {(coffees > 0 || isLocal) && (
          <FoodCard
            icon="☕"
            title="Coffee"
            count={coffees}
            steps={1}
            onClick={() => useCoffee().then(updateKing)}xs
          />
        )}
        {(!lastBonus || (ddiff(new Date(), lastBonus) > dms)) && (
          <FoodCard
            icon="🎁"
            title={"Daily bonus"}
            count={1}
            onClick={() => privateRequest("/api/food/bonus").then(updateKing)}
          />
        )}
        </div>
        <a class="resource" onClick={handleInvite}>
          <h2>Invite your friends</h2>
          <p>
            1 🥪 when your friend wakes up the King<br />
            1 ☕ when his friend wakes up the King
          </p>
          <p>{inviteMessage}</p>
        </a>
        {easterTaps <= 0 && (<div class="resource">
          <p>{JSON.stringify(king)}</p>
        </div>)}
        <div class="resource" onClick={() => setEasterTaps(easterTaps - 1)}>
          <h2>Top 10</h2>
          {top.map((user, i) => (
            <p>
              {i + 1}. {user.languageCode && `[${user.languageCode}]` || ''} {maskUsername(user.telegramUsername || user.telegramId)} - {user.steps} steps{user.coffees && `, ${user.coffees} ☕` || ''}{user.sandwiches && `, ${user.sandwiches} 🥪` || ''}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}
``