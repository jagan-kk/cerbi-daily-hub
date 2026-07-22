import { r as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, o as require_react, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { t as supabase } from "./client-B7SjN-VM.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-D_hiGrJN.mjs";
import { i as stringType, n as numberType, r as objectType, t as arrayType } from "../_libs/zod.mjs";
import { a as getShowcasePlaylists, c as searchSpotifyTracks, i as getPlaylistTracks, l as syncMyPlaylists, o as getSpotifyStatus, r as fetchMyPlaylists, s as getSpotifyToken, t as createSsrRpc } from "./spotify.functions-BMR7f-Op.mjs";
import { a as MessageCircle, i as Music, n as Settings, o as BookMarked, r as ScrollText, t as ShoppingBag } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/desktop-CFI3cZgC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useProfile() {
	return useQuery({
		queryKey: ["profile"],
		queryFn: async () => {
			const { data: u } = await supabase.auth.getUser();
			if (!u.user) return null;
			const { data, error } = await supabase.from("profiles").select("*").eq("id", u.user.id).maybeSingle();
			if (error) throw error;
			return data;
		}
	});
}
var OCCUPATIONS = [
	"Developer",
	"Designer",
	"Doctor",
	"Nurse",
	"Teacher",
	"Student",
	"Lawyer",
	"Finance",
	"Marketer",
	"Engineer",
	"Scientist",
	"Writer",
	"Entrepreneur",
	"Other"
];
var INTERESTS = [
	{
		id: "technology",
		label: "Tech"
	},
	{
		id: "business",
		label: "Business"
	},
	{
		id: "finance",
		label: "Finance"
	},
	{
		id: "health",
		label: "Health"
	},
	{
		id: "science",
		label: "Science"
	},
	{
		id: "politics",
		label: "Politics"
	},
	{
		id: "sports",
		label: "Sports"
	},
	{
		id: "entertainment",
		label: "Entertainment"
	},
	{
		id: "world",
		label: "World"
	},
	{
		id: "gaming",
		label: "Gaming"
	}
];
function randomRoomCode() {
	const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
	let out = "";
	for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * 31)];
	return out;
}
function OnboardingModal() {
	const [occupation, setOccupation] = (0, import_react.useState)("");
	const [selected, setSelected] = (0, import_react.useState)([]);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const qc = useQueryClient();
	const toggle = (id) => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
	const save = async () => {
		if (!occupation) return toast.error("Pick an occupation");
		if (selected.length === 0) return toast.error("Pick at least one interest");
		setBusy(true);
		const { data: u } = await supabase.auth.getUser();
		if (!u.user) return;
		const { error } = await supabase.from("profiles").update({
			occupation,
			interests: selected,
			onboarded: true
		}).eq("id", u.user.id);
		setBusy(false);
		if (error) return toast.error(error.message);
		qc.invalidateQueries({ queryKey: ["profile"] });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[9999] flex items-center justify-center p-4",
		style: { background: "oklch(0 0 0 / 0.7)" },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pixel-window w-full max-w-2xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pixel-window-bar px-3 py-2 font-display text-[11px]",
				children: "◆ CHARACTER SELECT"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-6 space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg",
						style: { color: "var(--color-accent)" },
						children: "CHOOSE YOUR CLASS"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 sm:grid-cols-3 gap-2",
						children: OCCUPATIONS.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: `pixel-btn text-[9px] ${occupation === o ? "variant-gold" : ""}`,
							onClick: () => setOccupation(o),
							children: o.toUpperCase()
						}, o))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg pt-2",
						style: { color: "var(--color-accent)" },
						children: "NEWS INTERESTS"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-body text-lg",
						style: { color: "var(--color-muted-foreground)" },
						children: "Pick topics for your daily news tome."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: INTERESTS.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: `pixel-btn text-[9px] ${selected.includes(i.id) ? "variant-gold" : ""}`,
							onClick: () => toggle(i.id),
							children: i.label.toUpperCase()
						}, i.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pt-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: save,
							disabled: busy,
							className: "pixel-btn variant-gold w-full",
							children: busy ? "..." : "ENTER CERBI"
						})
					})
				]
			})]
		})
	});
}
var iconMap = {
	tome: BookMarked,
	tavern: MessageCircle,
	scroll: ScrollText,
	coin: ShoppingBag,
	gear: Settings,
	music: Music
};
function PixelIcon({ name, size = 48 }) {
	const Icon = iconMap[name];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
		size,
		strokeWidth: 1.5,
		className: "text-[oklch(0.85_0.17_90)]"
	});
}
function Window({ title, onClose, children, initial, width = 720, height = 520, zIndex, onFocus }) {
	const [pos, setPos] = (0, import_react.useState)(initial ?? {
		x: 80,
		y: 60
	});
	const drag = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const move = (e) => {
			if (!drag.current) return;
			const maxX = window.innerWidth - 120;
			const maxY = window.innerHeight - 80;
			setPos({
				x: Math.max(-60, Math.min(maxX, e.clientX - drag.current.dx)),
				y: Math.max(0, Math.min(maxY, e.clientY - drag.current.dy))
			});
		};
		const up = () => drag.current = null;
		window.addEventListener("pointermove", move);
		window.addEventListener("pointerup", up);
		return () => {
			window.removeEventListener("pointermove", move);
			window.removeEventListener("pointerup", up);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pixel-window absolute flex flex-col",
		style: {
			left: pos.x,
			top: pos.y,
			width,
			height,
			maxWidth: "calc(100vw - 24px)",
			maxHeight: "calc(100vh - 80px)",
			zIndex
		},
		onPointerDown: onFocus,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pixel-window-bar flex items-center justify-between px-2 py-1 select-none",
			onPointerDown: (e) => {
				drag.current = {
					dx: e.clientX - pos.x,
					dy: e.clientY - pos.y
				};
				onFocus();
			},
			style: { cursor: "grab" },
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-display text-[10px] truncate pr-2",
				children: ["◆ ", title]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onClose,
				className: "font-display text-[10px] leading-none px-2 py-1",
				style: {
					background: "oklch(0.62 0.22 25)",
					color: "white",
					border: "2px solid oklch(0.08 0.02 260)"
				},
				"aria-label": "Close window",
				children: "X"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex-1 overflow-auto",
			style: { background: "var(--color-window)" },
			children
		})]
	});
}
var input = objectType({
	date: stringType().regex(/^\d{4}-\d{2}-\d{2}$/),
	topics: arrayType(stringType()).min(1).max(10)
});
/**
* Get news for a specific date and set of user interest topics.
* - Serves cached rows from `news_articles` when present.
* - Otherwise fetches from GNews API, then caches them.
* - Also clears news_articles rows from previous months on first fetch each day.
*/
var getNewsForDay = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => input.parse(d)).handler(createSsrRpc("a1be1efbada04e9518d46f29bd7912b8a2ae8718ee3c23a3322826f7f3202549"));
function daysInMonth(y, m) {
	return new Date(y, m + 1, 0).getDate();
}
function NewsApp({ profile }) {
	const now = /* @__PURE__ */ new Date();
	const [year] = (0, import_react.useState)(now.getFullYear());
	const [month] = (0, import_react.useState)(now.getMonth());
	const [selected, setSelected] = (0, import_react.useState)(null);
	const total = daysInMonth(year, month);
	const firstDow = new Date(year, month, 1).getDay();
	const cells = [];
	for (let i = 0; i < firstDow; i++) cells.push(null);
	for (let d = 1; d <= total; d++) cells.push(d);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-4 h-full flex flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "font-display text-sm",
				style: { color: "var(--color-accent)" },
				children: [
					now.toLocaleString("en", { month: "long" }).toUpperCase(),
					" ",
					year
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-body text-lg",
				style: { color: "var(--color-muted-foreground)" },
				children: "Older months burn away when a new one begins. Click a day to open its tome."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-7 gap-1 text-center font-display text-[9px]",
				children: ["SUN MON TUE WED THU FRI SAT".split(" ").map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "py-1",
					style: { color: "var(--color-muted-foreground)" },
					children: d
				}, d)), cells.map((d, i) => {
					const dateStr = d ? `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}` : null;
					const today = /* @__PURE__ */ new Date();
					const isFuture = !!(d && new Date(year, month, d).setHours(0, 0, 0, 0) > today.setHours(0, 0, 0, 0));
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						disabled: !d || isFuture,
						onClick: () => dateStr && setSelected(dateStr),
						className: "aspect-square flex flex-col items-center justify-center p-1",
						style: {
							background: d ? "oklch(0.28 0.05 260)" : "transparent",
							border: d ? "2px solid oklch(0.08 0.02 260)" : "none",
							opacity: isFuture ? .35 : 1,
							cursor: d && !isFuture ? "pointer" : "default"
						},
						children: d && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							viewBox: "0 0 16 16",
							width: "20",
							height: "20",
							shapeRendering: "crispEdges",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
									x: "3",
									y: "2",
									width: "10",
									height: "12",
									fill: "#8a2a2a"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
									x: "3",
									y: "2",
									width: "10",
									height: "1",
									fill: "#c14545"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
									x: "6",
									y: "6",
									width: "4",
									height: "1",
									fill: "#f6d34a"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
									x: "5",
									y: "8",
									width: "6",
									height: "1",
									fill: "#f6d34a"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[8px] mt-1",
							children: d
						})] })
					}, i);
				})]
			}),
			selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewsSheet, {
				date: selected,
				topics: profile.interests,
				onClose: () => setSelected(null)
			})
		]
	});
}
function NewsSheet({ date, topics, onClose }) {
	const { data, isLoading, error } = useQuery({
		queryKey: [
			"news",
			date,
			topics.join(",")
		],
		queryFn: () => getNewsForDay({ data: {
			date,
			topics
		} })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0 flex flex-col",
		style: { background: "var(--color-window)" },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between p-3 border-b-2",
			style: { borderColor: "oklch(0.08 0.02 260)" },
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "font-display text-[11px]",
				children: ["◆ TOME OF ", date]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "pixel-btn variant-ghost text-[9px]",
				onClick: onClose,
				children: "BACK"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 overflow-auto p-4 space-y-3",
			children: [
				isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-body text-lg animate-pixel-blink",
					children: "Loading headlines…"
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-body text-lg",
					style: { color: "var(--color-destructive)" },
					children: error.message
				}),
				data?.articles?.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-body text-lg",
					style: { color: "var(--color-muted-foreground)" },
					children: "No news found for this day."
				}),
				data?.articles?.map((a, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: a.url ?? "#",
					target: "_blank",
					rel: "noopener noreferrer",
					className: "pixel-card block hover:brightness-110",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-display text-[10px] mb-1",
							style: { color: "var(--color-accent)" },
							children: [
								a.source ?? a.topic,
								" · ",
								a.topic
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-body text-lg leading-tight",
							children: a.title
						}),
						a.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-body text-base mt-1",
							style: { color: "var(--color-muted-foreground)" },
							children: a.description
						})
					]
				}, idx))
			]
		})]
	});
}
function ChatApp({ profile }) {
	const [code, setCode] = (0, import_react.useState)(null);
	const [joinCode, setJoinCode] = (0, import_react.useState)("");
	if (!code) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-lg",
				style: { color: "var(--color-accent)" },
				children: "THE TAVERN"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-body text-lg",
				style: { color: "var(--color-muted-foreground)" },
				children: "Create a room and share the code, or join one with a code your friend gave you."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pixel-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-display text-[10px] mb-2",
					children: "JOIN ROOM"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "pixel-input font-display",
						placeholder: "ABCD12",
						value: joinCode,
						onChange: (e) => setJoinCode(e.target.value.toUpperCase().slice(0, 6)),
						maxLength: 6
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "pixel-btn",
						onClick: async () => {
							if (joinCode.length !== 6) return toast.error("Codes are 6 characters");
							const { data } = await supabase.from("chat_rooms").select("code").eq("code", joinCode).maybeSingle();
							if (!data) return toast.error("Room not found");
							setCode(joinCode);
						},
						children: "JOIN"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pixel-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-display text-[10px] mb-2",
					children: "CREATE ROOM"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "pixel-btn variant-gold",
					onClick: async () => {
						const c = randomRoomCode();
						const { error } = await supabase.from("chat_rooms").insert({
							code: c,
							creator_id: profile.id
						});
						if (error) return toast.error(error.message);
						setCode(c);
					},
					children: "NEW ROOM"
				})]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatRoom, {
		code,
		profile,
		onLeave: () => setCode(null)
	});
}
function ChatRoom({ code, profile, onLeave }) {
	const [messages, setMessages] = (0, import_react.useState)([]);
	const [text, setText] = (0, import_react.useState)("");
	const listRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		let mounted = true;
		supabase.from("chat_messages").select("*").eq("room_code", code).order("created_at", { ascending: true }).limit(200).then(({ data }) => {
			if (mounted && data) setMessages(data);
		});
		const channel = supabase.channel(`room:${code}`).on("postgres_changes", {
			event: "INSERT",
			schema: "public",
			table: "chat_messages",
			filter: `room_code=eq.${code}`
		}, (payload) => {
			setMessages((m) => [...m, payload.new]);
		}).subscribe();
		return () => {
			mounted = false;
			supabase.removeChannel(channel);
		};
	}, [code]);
	(0, import_react.useEffect)(() => {
		listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
	}, [messages]);
	const send = async () => {
		const body = text.trim();
		if (!body) return;
		setText("");
		const { error } = await supabase.from("chat_messages").insert({
			room_code: code,
			user_id: profile.id,
			username: profile.username,
			body
		});
		if (error) toast.error(error.message);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col h-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between p-2 border-b-2",
				style: { borderColor: "oklch(0.08 0.02 260)" },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-display text-[11px]",
					children: ["◆ ROOM ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						style: { color: "var(--color-accent)" },
						children: code
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "pixel-btn variant-ghost text-[9px]",
						onClick: () => {
							navigator.clipboard.writeText(code);
							toast.success("Code copied");
						},
						children: "COPY CODE"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "pixel-btn variant-ghost text-[9px]",
						onClick: onLeave,
						children: "LEAVE"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref: listRef,
				className: "flex-1 overflow-auto p-3 space-y-2",
				children: [messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-body text-lg leading-tight",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-display text-[9px] mr-2",
						style: { color: m.user_id === profile.id ? "var(--color-accent)" : "var(--color-primary)" },
						children: [m.username, ":"]
					}), m.body]
				}, m.id)), messages.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-body text-lg",
					style: { color: "var(--color-muted-foreground)" },
					children: "No messages yet. Break the silence."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-2 flex gap-2 border-t-2",
				style: { borderColor: "oklch(0.08 0.02 260)" },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "pixel-input",
					value: text,
					onChange: (e) => setText(e.target.value),
					onKeyDown: (e) => {
						if (e.key === "Enter") send();
					},
					placeholder: "say something..."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "pixel-btn variant-gold",
					onClick: send,
					children: "SEND"
				})]
			})
		]
	});
}
/** Ensure today's 10 questions exist for the caller's occupation, then return them (without the correct index). */
var getDailyQuestions = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("c31fe3ef3d878a9615f6e89eccbee0addcd044110e811c13a22e0248d7454fe5"));
var submitInput = objectType({ answers: arrayType(numberType().int().min(-1).max(3)).length(10) });
var submitDailyTrial = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => submitInput.parse(d)).handler(createSsrRpc("0db76b542cdf515cec6a53ace1f6b03413ab76b2731678ab20dd3a45d1de1c9b"));
var getLeaderboard = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("29fff5da6af31d00af77ec937b520bab841f00dfd01498109a529976e434d0d2"));
function DailyTrialApp({ profile }) {
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["daily-questions"],
		queryFn: () => getDailyQuestions()
	});
	const lb = useQuery({
		queryKey: ["leaderboard"],
		queryFn: () => getLeaderboard()
	});
	const [phase, setPhase] = (0, import_react.useState)("intro");
	const [answers, setAnswers] = (0, import_react.useState)(Array(10).fill(-1));
	const [idx, setIdx] = (0, import_react.useState)(0);
	const [remaining, setRemaining] = (0, import_react.useState)(15);
	const [result, setResult] = (0, import_react.useState)(null);
	const submit = useMutation({
		mutationFn: (ans) => submitDailyTrial({ data: { answers: ans } }),
		onSuccess: (res) => {
			setResult({
				score: res.score,
				correct: res.correct
			});
			setPhase("done");
			qc.invalidateQueries({ queryKey: ["profile"] });
			qc.invalidateQueries({ queryKey: ["leaderboard"] });
			qc.invalidateQueries({ queryKey: ["daily-questions"] });
			toast.success(`+${res.score} points`);
		},
		onError: (e) => toast.error(e.message ?? "Failed")
	});
	(0, import_react.useEffect)(() => {
		if (phase !== "playing") return;
		setRemaining(15);
		const start = Date.now();
		const interval = setInterval(() => {
			const left = 15 - Math.floor((Date.now() - start) / 1e3);
			setRemaining(Math.max(0, left));
			if (left <= 0) {
				clearInterval(interval);
				goNext(-1);
			}
		}, 200);
		return () => clearInterval(interval);
	}, [idx, phase]);
	function pick(choice) {
		goNext(choice);
	}
	function goNext(choice) {
		const next = [...answers];
		next[idx] = choice;
		setAnswers(next);
		if (idx >= 9) {
			submit.mutate(next);
			setPhase("done");
		} else setIdx(idx + 1);
	}
	if (q.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-6 font-body text-lg animate-pixel-blink",
		children: "Preparing trial…"
	});
	if (q.error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-6 font-body text-lg",
		style: { color: "var(--color-destructive)" },
		children: q.error.message
	});
	if (!q.data) return null;
	const questions = q.data.questions;
	if (q.data.completed && phase === "intro") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-lg",
				style: { color: "var(--color-accent)" },
				children: "DAILY TRIAL"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-body text-xl",
				children: "You already conquered today's trial."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-body text-lg",
				children: ["Score: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
					style: { color: "var(--color-accent)" },
					children: q.data.lastScore
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaderboard, {
				data: lb.data,
				profileId: profile.id
			})
		]
	});
	if (phase === "intro") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-lg",
				style: { color: "var(--color-accent)" },
				children: "DAILY TRIAL"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "font-body text-lg space-y-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Class: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: q.data.occupation })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						"Questions: ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "10" }),
						" · Time each: ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "15s" })
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "+10 points per correct answer. Weekly rankings reset every Monday." })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "pixel-btn variant-gold",
				onClick: () => setPhase("playing"),
				children: "BEGIN"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaderboard, {
				data: lb.data,
				profileId: profile.id
			})
		]
	});
	if (phase === "done") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-lg",
				style: { color: "var(--color-accent)" },
				children: "RESULTS"
			}),
			submit.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "animate-pixel-blink font-body text-lg",
				children: "Tallying…"
			}),
			result && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "font-body text-2xl",
				children: [
					result.correct,
					" / 10 correct — ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", {
						style: { color: "var(--color-accent)" },
						children: [
							"+",
							result.score,
							" pts"
						]
					})
				]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaderboard, {
				data: lb.data,
				profileId: profile.id
			})
		]
	});
	const cur = questions[idx];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-display text-[11px]",
					children: [
						"Q ",
						idx + 1,
						" / 10"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-display text-[14px]",
					style: { color: remaining <= 5 ? "var(--color-destructive)" : "var(--color-accent)" },
					children: [remaining, "s"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pixel-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-body text-xl leading-tight",
					children: cur.question
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2",
				children: cur.choices.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "pixel-btn text-left",
					onClick: () => pick(i),
					children: [
						String.fromCharCode(65 + i),
						". ",
						c
					]
				}, i))
			})
		]
	});
}
function Leaderboard({ data, profileId }) {
	if (!data) return null;
	const rows = data.rows ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pixel-card mt-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "font-display text-[10px] mb-2",
				style: { color: "var(--color-accent)" },
				children: ["WEEKLY RANKINGS — ", data.occupation ?? "?"]
			}),
			rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-body text-lg",
				style: { color: "var(--color-muted-foreground)" },
				children: "No scores yet this week."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "space-y-1",
				children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex justify-between font-body text-lg",
					style: { color: r.user_id === profileId ? "var(--color-accent)" : void 0 },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"#",
						r.rank,
						" ",
						r.username
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: r.total_score })]
				}, r.user_id))
			})
		]
	});
}
function ShopApp({ profile }) {
	const qc = useQueryClient();
	const items = useQuery({
		queryKey: ["shop-items"],
		queryFn: async () => {
			const { data } = await supabase.from("shop_items").select("*").order("cost");
			return data ?? [];
		}
	});
	const inv = useQuery({
		queryKey: ["inventory", profile.id],
		queryFn: async () => {
			const { data } = await supabase.from("user_inventory").select("item_id").eq("user_id", profile.id);
			return new Set((data ?? []).map((r) => r.item_id));
		}
	});
	const buy = async (id) => {
		const { error } = await supabase.rpc("purchase_item", { item: id });
		if (error) return toast.error(error.message);
		qc.invalidateQueries({ queryKey: ["profile"] });
		qc.invalidateQueries({ queryKey: ["inventory", profile.id] });
		toast.success("Purchased!");
	};
	const apply = async (kind, asset_key) => {
		const patch = kind === "font" ? { active_font: asset_key } : { active_wallpaper: asset_key };
		const { error } = await supabase.from("profiles").update(patch).eq("id", profile.id);
		if (error) return toast.error(error.message);
		qc.invalidateQueries({ queryKey: ["profile"] });
		toast.success("Applied");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-4 space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex justify-between items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-lg",
				style: { color: "var(--color-accent)" },
				children: "SHOP OF WARES"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pixel-badge",
				children: [profile.wallet_points, " PTS"]
			})]
		}), ["font", "wallpaper"].map((kind) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "font-display text-[11px] mb-2",
			children: [kind.toUpperCase(), "S"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 md:grid-cols-3 gap-2",
			children: items.data?.filter((i) => i.kind === kind).map((i) => {
				const owned = inv.data?.has(i.id) || i.cost === 0;
				const active = kind === "font" && profile.active_font === i.asset_key || kind === "wallpaper" && profile.active_wallpaper === i.asset_key;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pixel-card space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `font-display text-[11px] font-${i.asset_key}`,
							children: i.name
						}),
						i.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-body text-base",
							style: { color: "var(--color-muted-foreground)" },
							children: i.description
						}),
						kind === "wallpaper" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `wp-${i.asset_key} h-12`,
							style: { border: "2px solid oklch(0.08 0.02 260)" }
						}),
						active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "pixel-btn variant-ghost w-full",
							disabled: true,
							children: "ACTIVE"
						}) : owned ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "pixel-btn w-full",
							onClick: () => apply(i.kind, i.asset_key),
							children: "APPLY"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "pixel-btn variant-gold w-full",
							onClick: () => buy(i.id),
							disabled: profile.wallet_points < i.cost,
							children: ["BUY ", i.cost]
						})
					]
				}, i.id);
			})
		})] }, kind))]
	});
}
function MusicApp({ profile }) {
	const [connected, setConnected] = (0, import_react.useState)(null);
	const [accessToken, setAccessToken] = (0, import_react.useState)(null);
	const [activeTab, setActiveTab] = (0, import_react.useState)("playlists");
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [searchTrigger, setSearchTrigger] = (0, import_react.useState)(0);
	const [player, setPlayer] = (0, import_react.useState)(null);
	const [deviceId, setDeviceId] = (0, import_react.useState)(null);
	const [currentTrack, setCurrentTrack] = (0, import_react.useState)(null);
	const [isPlaying, setIsPlaying] = (0, import_react.useState)(false);
	const [volume, setVolume] = (0, import_react.useState)(.5);
	const [playerBusy, setPlayerBusy] = (0, import_react.useState)(false);
	const [playlistTracks, setPlaylistTracks] = (0, import_react.useState)([]);
	const [selectedPlaylistId, setSelectedPlaylistId] = (0, import_react.useState)(null);
	const playerInitRef = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		getSpotifyStatus().then((s) => setConnected(s.connected)).catch(() => setConnected(false));
	}, []);
	(0, import_react.useEffect)(() => {
		if (!connected) return;
		getSpotifyToken().then((t) => setAccessToken(t.access_token)).catch(() => setConnected(false));
	}, [connected]);
	(0, import_react.useEffect)(() => {
		if (!accessToken || playerInitRef.current) return;
		playerInitRef.current = true;
		const script = document.createElement("script");
		script.src = "https://sdk.scdn.co/spotify-player.js";
		script.async = true;
		document.body.appendChild(script);
		window.onSpotifyWebPlaybackSDKReady = () => {
			const p = new window.Spotify.Player({
				name: "Cerbi OS Player",
				getOAuthToken: (cb) => {
					getSpotifyToken().then((t) => cb(t.access_token)).catch(() => {});
				},
				volume
			});
			p.addListener("ready", ({ device_id }) => {
				setDeviceId(device_id);
			});
			p.addListener("not_ready", () => {
				setDeviceId(null);
			});
			p.addListener("player_state_changed", (state) => {
				if (!state) return;
				setIsPlaying(!state.paused);
				if (state.track_window?.current_track) {
					const t = state.track_window.current_track;
					setCurrentTrack({
						id: t.id,
						name: t.name,
						artists: t.artists?.map((a) => a.name) ?? [],
						album: {
							name: t.album?.name ?? "",
							image_url: t.album?.images?.[0]?.url ?? null
						},
						duration_ms: t.duration,
						uri: t.uri
					});
				}
			});
			p.connect();
			setPlayer(p);
		};
		return () => {
			const sp = document.querySelector("script[src=\"https://sdk.scdn.co/spotify-player.js\"]");
			if (sp) sp.remove();
		};
	}, [accessToken, volume]);
	const { data: playlists, refetch: refetchPlaylists } = useQuery({
		queryKey: ["spotify-playlists"],
		queryFn: () => fetchMyPlaylists(),
		enabled: !!connected
	});
	const { data: showcase } = useQuery({
		queryKey: ["spotify-showcase"],
		queryFn: () => getShowcasePlaylists(),
		enabled: !!connected
	});
	const { data: searchResults } = useQuery({
		queryKey: [
			"spotify-search",
			searchQuery,
			searchTrigger
		],
		queryFn: () => searchSpotifyTracks({ data: { query: searchQuery } }),
		enabled: searchTrigger > 0
	});
	const handleSearch = () => {
		if (searchQuery.trim()) setSearchTrigger((s) => s + 1);
	};
	const ensurePlayback = async () => {
		if (!player || !deviceId || playerBusy) return;
		setPlayerBusy(true);
		try {
			const token = accessToken || (await getSpotifyToken()).access_token;
			await fetch("https://api.spotify.com/v1/me/player", {
				method: "PUT",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					device_ids: [deviceId],
					play: false
				})
			});
		} catch {} finally {
			setPlayerBusy(false);
		}
	};
	const playTracks = async (uris) => {
		if (!player) return;
		try {
			await player.play({ uris });
		} catch {
			await ensurePlayback();
			await new Promise((r) => setTimeout(r, 300));
			await player.play({ uris });
		}
	};
	const playPlaylist = async (uri) => {
		if (!player) return;
		try {
			await player.play({ context_uri: uri });
		} catch {
			await ensurePlayback();
			await new Promise((r) => setTimeout(r, 300));
			await player.play({ context_uri: uri });
		}
	};
	const loadPlaylistTracks = async (playlistId) => {
		if (selectedPlaylistId === playlistId) {
			setSelectedPlaylistId(null);
			setPlaylistTracks([]);
			return;
		}
		setSelectedPlaylistId(playlistId);
		try {
			const tracks = await getPlaylistTracks({ data: { playlistId } });
			setPlaylistTracks(tracks);
		} catch {
			setPlaylistTracks([]);
		}
	};
	const syncToShowcase = async () => {
		await syncMyPlaylists();
		refetchPlaylists();
	};
	if (connected === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-6 flex items-center justify-center h-full",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "font-display text-lg animate-pixel-blink",
			children: "LOADING..."
		})
	});
	if (!connected) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 flex flex-col items-center justify-center h-full gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-display text-lg",
				style: { color: "var(--color-accent)" },
				children: "MUSIC PLAYER"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-body text-lg text-center",
				style: { color: "var(--color-muted-foreground)" },
				children: "Connect your Spotify to play music from the desktop."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "/api/spotify/auth",
				className: "pixel-btn variant-gold inline-block",
				children: "CONNECT SPOTIFY"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col h-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex border-b-2 shrink-0",
				style: { borderColor: "oklch(0.08 0.02 260)" },
				children: [
					"playlists",
					"search",
					"showcase"
				].map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setActiveTab(tab),
					className: "flex-1 font-display text-[9px] py-2",
					style: {
						background: activeTab === tab ? "var(--color-accent)" : "transparent",
						color: activeTab === tab ? "black" : "var(--color-muted-foreground)"
					},
					children: tab === "playlists" ? "MY PLAYLISTS" : tab === "search" ? "SEARCH" : "SHOWCASE"
				}, tab))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 overflow-auto p-3",
				children: [
					activeTab === "playlists" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-center mb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-display text-[10px]",
									children: "YOUR PLAYLISTS"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "pixel-btn variant-ghost text-[8px]",
									onClick: syncToShowcase,
									children: "SYNC TO SHOWCASE"
								})]
							}),
							!playlists?.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-body text-lg",
								style: { color: "var(--color-muted-foreground)" },
								children: "No playlists found."
							}),
							playlists?.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => playPlaylist(`spotify:playlist:${p.id}`),
									className: "pixel-card w-full text-left flex items-center gap-3 hover:brightness-110",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-10 h-10 shrink-0 bg-[oklch(0.2_0.03_260)] rounded",
										style: p.image_url ? {
											backgroundImage: `url(${p.image_url})`,
											backgroundSize: "cover"
										} : {}
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-display text-[10px] truncate",
											children: p.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "font-body text-base",
											style: { color: "var(--color-muted-foreground)" },
											children: [p.track_count, " tracks"]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "font-display text-[8px] ml-[3.25rem] mt-1",
									style: { color: "var(--color-accent)" },
									onClick: () => loadPlaylistTracks(p.id),
									children: selectedPlaylistId === p.id ? "HIDE TRACKS" : "SHOW TRACKS"
								}),
								selectedPlaylistId === p.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "ml-[3.25rem] mt-1 space-y-1",
									children: playlistTracks.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => playTracks([t.uri]),
										className: "block w-full text-left font-body text-base hover:brightness-110 px-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-display text-[9px]",
											style: { color: "var(--color-accent)" },
											children: t.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "ml-2",
											style: { color: "var(--color-muted-foreground)" },
											children: t.artists.join(", ")
										})]
									}, t.id))
								})
							] }, p.id))
						]
					}),
					activeTab === "search" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "pixel-input flex-1",
								placeholder: "Search tracks...",
								value: searchQuery,
								onChange: (e) => setSearchQuery(e.target.value),
								onKeyDown: (e) => e.key === "Enter" && handleSearch()
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "pixel-btn",
								onClick: handleSearch,
								children: "SEARCH"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-1",
							children: searchResults?.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => playTracks([t.uri]),
								className: "pixel-card w-full text-left flex items-center gap-3 hover:brightness-110",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-10 h-10 shrink-0 bg-[oklch(0.2_0.03_260)] rounded",
									style: t.album?.image_url ? {
										backgroundImage: `url(${t.album.image_url})`,
										backgroundSize: "cover"
									} : {}
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-display text-[10px] truncate",
										children: t.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-body text-base",
										style: { color: "var(--color-muted-foreground)" },
										children: t.artists.join(", ")
									})]
								})]
							}, t.id))
						})]
					}),
					activeTab === "showcase" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-display text-[10px] mb-2",
								children: "COMMUNITY PLAYLISTS"
							}),
							!showcase?.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-body text-lg",
								style: { color: "var(--color-muted-foreground)" },
								children: "No shared playlists yet. Sync yours!"
							}),
							showcase?.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => playPlaylist(`spotify:playlist:${p.id}`),
								className: "pixel-card w-full text-left flex items-center gap-3 hover:brightness-110",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-10 h-10 shrink-0 bg-[oklch(0.2_0.03_260)] rounded",
									style: p.image_url ? {
										backgroundImage: `url(${p.image_url})`,
										backgroundSize: "cover"
									} : {}
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-display text-[10px] truncate",
										children: p.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "font-body text-base",
										style: { color: "var(--color-muted-foreground)" },
										children: [
											"by ",
											p.profiles?.username,
											" · ",
											p.track_count,
											" tracks"
										]
									})]
								})]
							}) }, p.id))
						]
					})
				]
			}),
			player && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "shrink-0 border-t-2 p-2 flex items-center gap-3",
				style: {
					borderColor: "oklch(0.08 0.02 260)",
					background: "oklch(0.12 0.03 260)"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-10 h-10 shrink-0 bg-[oklch(0.2_0.03_260)] rounded",
						style: currentTrack?.album?.image_url ? {
							backgroundImage: `url(${currentTrack.album.image_url})`,
							backgroundSize: "cover"
						} : {}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-[9px] truncate",
							children: currentTrack?.name ?? "No track"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-body text-base truncate",
							style: { color: "var(--color-muted-foreground)" },
							children: currentTrack?.artists?.join(", ") ?? ""
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "pixel-btn variant-ghost text-[9px] px-1",
								onClick: () => player.previousTrack(),
								children: "⏮"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "pixel-btn variant-gold text-[9px] px-2",
								onClick: () => isPlaying ? player.pause() : player.resume(),
								children: isPlaying ? "⏸" : "▶"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "pixel-btn variant-ghost text-[9px] px-1",
								onClick: () => player.nextTrack(),
								children: "⏭"
							})
						]
					})
				]
			})
		]
	});
}
var APPS = [
	{
		key: "news",
		title: "News Tome",
		icon: "tome"
	},
	{
		key: "chat",
		title: "Chat Tavern",
		icon: "tavern"
	},
	{
		key: "trial",
		title: "Daily Trial",
		icon: "scroll"
	},
	{
		key: "shop",
		title: "Shop of Wares",
		icon: "coin"
	},
	{
		key: "music",
		title: "Music Player",
		icon: "music"
	}
];
var FONT_STYLES = {
	"press-start": {
		display: "'Press Start 2P', system-ui, monospace",
		body: "'VT323', 'Courier New', monospace"
	},
	vt323: {
		display: "'VT323', monospace",
		body: "'VT323', monospace"
	},
	pixelify: {
		display: "'Pixelify Sans', system-ui, monospace",
		body: "'VT323', 'Courier New', monospace"
	},
	silkscreen: {
		display: "'Silkscreen', system-ui, monospace",
		body: "'VT323', 'Courier New', monospace"
	}
};
function Desktop() {
	const { data: profile, isLoading } = useProfile();
	const [open, setOpen] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [z, setZ] = (0, import_react.useState)({
		news: 1,
		chat: 1,
		trial: 1,
		shop: 1,
		music: 1
	});
	const [top, setTop] = (0, import_react.useState)(2);
	const navigate = useNavigate();
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen wp-grid-purple flex items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "font-display text-lg animate-pixel-blink",
			style: { color: "var(--color-accent)" },
			children: "LOADING…"
		})
	});
	if (!profile) return null;
	if (!profile.onboarded) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OnboardingModal, {});
	const wallpaper = `wp-${profile.active_wallpaper || "grid-teal"}`;
	const fonts = FONT_STYLES[profile.active_font] || FONT_STYLES["press-start"];
	const openApp = (k) => {
		setOpen((s) => new Set(s).add(k));
		focus(k);
	};
	const closeApp = (k) => {
		setOpen((s) => {
			const n = new Set(s);
			n.delete(k);
			return n;
		});
	};
	const focus = (k) => {
		setTop((t) => {
			setZ((zz) => ({
				...zz,
				[k]: t + 1
			}));
			return t + 1;
		});
	};
	const signOut = async () => {
		await supabase.auth.signOut();
		navigate({ to: "/auth" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `min-h-screen ${wallpaper} relative overflow-hidden`,
		style: {
			"--font-display": fonts.display,
			"--font-body": fonts.body
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute top-0 left-0 right-0 flex items-center justify-between px-3 py-2 bg-[oklch(0.08_0.02_260)] text-[oklch(0.95_0.02_90)] font-display text-[10px] z-50 border-b-2 border-[oklch(0.7_0.15_85)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "◆ CERBI.OS" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						profile.username,
						" · ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							style: { color: "var(--color-accent)" },
							children: [profile.wallet_points, " PTS"]
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: signOut,
						className: "pixel-btn variant-ghost text-[9px] py-1 px-2",
						children: "LOGOUT"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pt-14 pl-4 grid grid-cols-2 md:grid-cols-1 gap-4 w-32 md:w-28",
				children: APPS.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onDoubleClick: () => openApp(a.key),
					onClick: () => openApp(a.key),
					className: "flex flex-col items-center gap-1 group",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelIcon, { name: a.icon }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-[9px] px-1 py-0.5 group-hover:bg-[oklch(0.7_0.15_85)] group-hover:text-black",
						style: {
							color: "oklch(0.98 0.01 90)",
							textShadow: "1px 1px 0 #000"
						},
						children: a.title.toUpperCase()
					})]
				}, a.key))
			}),
			APPS.map((a) => open.has(a.key) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Window, {
				title: a.title,
				onClose: () => closeApp(a.key),
				onFocus: () => focus(a.key),
				zIndex: z[a.key],
				children: [
					a.key === "news" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewsApp, { profile }),
					a.key === "chat" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatApp, { profile }),
					a.key === "trial" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DailyTrialApp, { profile }),
					a.key === "shop" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShopApp, { profile }),
					a.key === "music" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MusicApp, { profile })
				]
			}, a.key) : null)
		]
	});
}
//#endregion
export { Desktop as component };
