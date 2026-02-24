/**
 * SENSE OF DEFEAT - Game Modal Components
 * Design: Retro Neo Arcade - pixel art UI panels
 * Shown when player touches gimmick doors
 */

import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { MOCK_DISCOGRAPHY, MOCK_LIVE_EVENTS } from "@/data/mockData";

interface GameModalProps {
  type: string;
  onClose: () => void;
}

function PixelBorder({
  children,
  color = "#00e5ff",
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <div
      className="relative"
      style={{
        border: `3px solid ${color}`,
        boxShadow: `0 0 20px ${color}44, inset 0 0 20px ${color}11, 0 0 60px ${color}22`,
        background:
          "linear-gradient(135deg, #0a0a2e 0%, #0d0d3a 50%, #0a0a2e 100%)",
        imageRendering: "pixelated",
      }}
    >
      {/* Corner decorations */}
      <div
        className="absolute top-0 left-0 w-4 h-4"
        style={{
          borderRight: `3px solid ${color}`,
          borderBottom: `3px solid ${color}`,
          background: color,
        }}
      />
      <div
        className="absolute top-0 right-0 w-4 h-4"
        style={{
          borderLeft: `3px solid ${color}`,
          borderBottom: `3px solid ${color}`,
          background: color,
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-4 h-4"
        style={{
          borderRight: `3px solid ${color}`,
          borderTop: `3px solid ${color}`,
          background: color,
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-4 h-4"
        style={{
          borderLeft: `3px solid ${color}`,
          borderTop: `3px solid ${color}`,
          background: color,
        }}
      />
      {children}
    </div>
  );
}

function ProfileModal({ onClose }: { onClose: () => void }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
  }, []);

  const members = [
    {
      name: "Toshi",
      role: "Vo.",
      color: "#ff6d00",
      desc: "バンドの顔。激しいシャウトと繊細なメロディを使い分けるフロントマン。",
      img: "/toshi.png",
    },
    {
      name: "Yuichi",
      role: "Gt.",
      color: "#00e5ff",
      desc: "歪んだリフと泣きのソロで楽曲に魂を吹き込む。",
      img: "/yuichi.png",
    },
    {
      name: "Ramirez",
      role: "Gt./Cho.",
      color: "#e040fb",
      desc: "コーラスとギターを兼任。ハーモニーとリフでサウンドに厚みを加える。",
      img: "/ramirez.png",
    },
    {
      name: "Yuj",
      role: "Ba./Cho.",
      color: "#aa00ff",
      desc: "重厚なグルーヴとコーラスでバンドサウンドの土台を支える。",
      img: "/yuj.png",
    },
    {
      name: "Mirko",
      role: "Dr.",
      color: "#ff1744",
      desc: "手数の多いドラミングでライブを爆発的に盛り上げる。",
      img: "/mirko.png",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: "rgba(0,0,0,0.85)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s",
      }}
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Fixed close button - always visible top-right */}
      <button
        onClick={onClose}
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 60,
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "14px",
          color: "#000",
          background: "#00e5ff",
          border: "3px solid #00e5ff",
          width: 44,
          height: 44,
          cursor: "pointer",
          boxShadow: "0 0 20px #00e5ff88",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: 1,
        }}
      >
        ✕
      </button>
      <div style={{ maxWidth: 680, width: "100%" }}>
        <PixelBorder color="#00e5ff">
          <div
            className="p-6"
            style={{ maxHeight: "85dvh", overflowY: "auto" }}
          >
            {/* Header */}
            <div className="text-center mb-6">
              <div
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: "14px",
                  color: "#00e5ff",
                  textShadow: "0 0 10px #00e5ff",
                  letterSpacing: "2px",
                  marginBottom: "8px",
                }}
              >
                ★ PROFILE ★
              </div>
              <div
                style={{
                  color: "#ffffff88",
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: "8px",
                }}
              >
                STAGE CLEAR! MEMBER DATA UNLOCKED
              </div>
            </div>

            {/* Band description */}
            <div
              className="mb-6 p-4"
              style={{
                border: "1px solid #00e5ff44",
                background: "#00e5ff0a",
                fontFamily: "'Noto Sans JP', sans-serif",
                color: "#e0e0e0",
                fontSize: "13px",
                lineHeight: "1.8",
              }}
            >
              <span
                style={{
                  color: "#00e5ff",
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: "10px",
                }}
              >
                SENSE OF DEFEAT
              </span>
              <br />
              <br />
              2016年の結成以来、地元・熊谷や都内を中心に精力的に活動中。
              テクニカルなギターリフと、エモーショナルで疾走感あふれるメロディを武器にした、独自のメタルコアサウンドを構築。
            </div>

            {/* Members */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {members.map((m, i) => (
                <div
                  key={m.role}
                  className="p-3 flex gap-3 items-start"
                  style={{
                    border: `2px solid ${m.color}44`,
                    background: `${m.color}0a`,
                    // Last item spans full width if odd total
                    gridColumn:
                      i === members.length - 1 && members.length % 2 !== 0
                        ? "1 / -1"
                        : undefined,
                  }}
                >
                  <div
                    style={{
                      flexShrink: 0,
                      width: "70px",
                      height: "90px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "flex-end",
                      background: "rgba(0,0,0,0.5)",
                      border: `1px solid ${m.color}66`,
                      borderRadius: "4px",
                    }}
                  >
                    <img
                      src={m.img}
                      alt={m.name}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                        imageRendering: "pixelated",
                      }}
                    />
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: "8px",
                        color: m.color,
                        marginBottom: "4px",
                      }}
                    >
                      {m.role}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: "10px",
                        color: "#ffffff",
                        marginBottom: "6px",
                      }}
                    >
                      {m.name}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Noto Sans JP', sans-serif",
                        fontSize: "11px",
                        color: "#aaaaaa",
                        lineHeight: "1.6",
                      }}
                    >
                      {m.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* SNS Links */}
            <div className="flex gap-3 justify-center mb-6">
              {[
                { name: "X (Twitter)", url: "https://x.com/sod_official_tw" },
                { name: "Instagram", url: "https://www.instagram.com/senseofdefeat/" },
                { name: "YouTube", url: "https://www.youtube.com/@senseofdefeat4937" },
              ].map(sns => (
                <a
                  key={sns.name}
                  href={sns.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2"
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: "7px",
                    color: "#00e5ff",
                    border: "2px solid #00e5ff",
                    background: "transparent",
                    cursor: "pointer",
                    textDecoration: "none",
                    transition: "all 0.1s",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.background =
                      "#00e5ff";
                    (e.currentTarget as HTMLAnchorElement).style.color = "#000";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.background =
                      "transparent";
                    (e.currentTarget as HTMLAnchorElement).style.color = "#00e5ff";
                  }}
                >
                  {sns.name}
                </a>
              ))}
            </div>

            <CloseButton onClose={onClose} color="#00e5ff" />
          </div>
        </PixelBorder>
      </div>
    </div>
  );
}

function DiscographyModal({ onClose }: { onClose: () => void }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
  }, []);

  const discoData = MOCK_DISCOGRAPHY;
  const discoLoading = false;

  // Color palette for releases (cycles through)
  const colorPalette = [
    "#aa00ff",
    "#e040fb",
    "#7c4dff",
    "#00e5ff",
    "#ff6d00",
    "#ff1744",
    "#00e676",
  ];

  const releases = discoData.map((item, i) => ({
    title: item.title,
    type: item.type.replace("_", " ").toUpperCase(),
    year: String(item.releaseYear),
    color: colorPalette[i % colorPalette.length],
    link: item.streamingUrl ?? item.downloadUrl ?? "",
    description: item.description,
    coverImageUrl: item.coverImageUrl,
  }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: "rgba(0,0,0,0.85)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s",
      }}
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 60,
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "14px",
          color: "#000",
          background: "#aa00ff",
          border: "3px solid #aa00ff",
          width: 44,
          height: 44,
          cursor: "pointer",
          boxShadow: "0 0 20px #aa00ff88",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: 1,
        }}
      >
        ✕
      </button>
      <div style={{ maxWidth: 680, width: "100%" }}>
        <PixelBorder color="#aa00ff">
          <div
            className="p-6"
            style={{ maxHeight: "85dvh", overflowY: "auto" }}
          >
            <div className="text-center mb-6">
              <div
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: "14px",
                  color: "#aa00ff",
                  textShadow: "0 0 10px #aa00ff",
                  letterSpacing: "2px",
                  marginBottom: "8px",
                }}
              >
                ♪ DISCOGRAPHY ♪
              </div>
              <div
                style={{
                  color: "#ffffff88",
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: "8px",
                }}
              >
                ALL RELEASES UNLOCKED
              </div>
            </div>

            <div
              className="space-y-4 mb-6"
              style={{ maxHeight: "50dvh", overflowY: "auto" }}
            >
              {releases.map(r => (
                <div
                  key={r.title}
                  className="p-4"
                  style={{
                    border: `2px solid ${r.color}66`,
                    background: `${r.color}0d`,
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div
                        style={{
                          fontFamily: "'Press Start 2P', monospace",
                          fontSize: "7px",
                          color: r.color,
                          marginBottom: "4px",
                        }}
                      >
                        {r.type} / {r.year}
                      </div>
                      <div
                        style={{
                          fontFamily: "'Press Start 2P', monospace",
                          fontSize: "12px",
                          color: "#ffffff",
                        }}
                      >
                        {r.title}
                      </div>
                    </div>
                    {r.coverImageUrl ? (
                      <div
                        style={{
                          width: 56,
                          height: 56,
                          border: `2px solid ${r.color}`,
                          flexShrink: 0,
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={r.coverImageUrl}
                          alt={r.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        style={{
                          width: 56,
                          height: 56,
                          background: `linear-gradient(135deg, ${r.color}44, ${r.color}22)`,
                          border: `2px solid ${r.color}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <div
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            border: `3px solid ${r.color}`,
                            position: "relative",
                          }}
                        >
                          <div
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: r.color,
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%,-50%)",
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  {"description" in r &&
                    typeof (r as { description?: string | null })
                      .description === "string" && (
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#aaaaaa",
                          padding: "4px 0",
                          marginBottom: "8px",
                          fontFamily: "'Noto Sans JP', sans-serif",
                        }}
                      >
                        {(r as { description: string }).description}
                      </div>
                    )}
                  <a
                    href={r.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-block",
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: "7px",
                      color: r.color,
                      border: `1px solid ${r.color}`,
                      padding: "4px 8px",
                      textDecoration: "none",
                      transition: "all 0.1s",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLAnchorElement).style.background =
                        r.color;
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        "#000";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLAnchorElement).style.background =
                        "transparent";
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        r.color;
                    }}
                  >
                    ▶ STREAMING / DOWNLOAD
                  </a>
                </div>
              ))}
            </div>

            <CloseButton onClose={onClose} color="#aa00ff" />
          </div>
        </PixelBorder>
      </div>
    </div>
  );
}

function LiveModal({ onClose }: { onClose: () => void }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
  }, []);

  const liveData = MOCK_LIVE_EVENTS;
  const liveLoading = false;

  // Convert DB data to display format
  const today = new Date().toISOString().split("T")[0];
  const lives = liveData.map(event => {
    const ev = event as any;
    const isUpcoming = ev.eventDate >= today;
    return {
      date: ev.eventDate.replace(/-/g, "."),
      venue: ev.venueName + (ev.venueCity ? ` (${ev.venueCity})` : ""),
      name: ev.eventTitle ?? ev.venueName,
      status: isUpcoming ? "UPCOMING" : "ENDED",
      color: isUpcoming ? "#ff6d00" : "#555555",
      ticketUrl: ev.ticketUrl,
      flyerImageUrl: ev.flyerImageUrl as string | null | undefined,
    };
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: "rgba(0,0,0,0.85)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s",
      }}
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 60,
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "14px",
          color: "#000",
          background: "#ff6d00",
          border: "3px solid #ff6d00",
          width: 44,
          height: 44,
          cursor: "pointer",
          boxShadow: "0 0 20px #ff6d0088",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: 1,
        }}
      >
        ✕
      </button>
      <div style={{ maxWidth: 680, width: "100%" }}>
        <PixelBorder color="#ff6d00">
          <div
            className="p-6"
            style={{ maxHeight: "85dvh", overflowY: "auto" }}
          >
            <div className="text-center mb-6">
              <div
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: "14px",
                  color: "#ff6d00",
                  textShadow: "0 0 10px #ff6d00",
                  letterSpacing: "2px",
                  marginBottom: "8px",
                }}
              >
                ♦ LIVE INFO ♦
              </div>
              <div
                style={{
                  color: "#ffffff88",
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: "8px",
                }}
              >
                STAGE SCHEDULE LOADED
              </div>
            </div>

            <div
              className="space-y-3 mb-6"
              style={{ maxHeight: "50dvh", overflowY: "auto" }}
            >
              {liveLoading && (
                <div
                  style={{
                    color: "#ffffff44",
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: "8px",
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  LOADING...
                </div>
              )}
              {!liveLoading && lives.length === 0 && (
                <div
                  style={{
                    color: "#ffffff44",
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: "8px",
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  NO UPCOMING EVENTS
                </div>
              )}
              {lives.map((live, i) => (
                <div
                  key={i}
                  className="p-3"
                  style={{
                    border: `2px solid ${live.color}44`,
                    background: `${live.color}0a`,
                    opacity: live.status === "ENDED" ? 0.6 : 1,
                    display: "flex",
                    gap: "12px",
                    alignItems: "flex-start",
                  }}
                >
                  {/* Flyer thumbnail */}
                  {live.flyerImageUrl && (
                    <div style={{ flexShrink: 0 }}>
                      <img
                        src={live.flyerImageUrl}
                        alt="flyer"
                        style={{
                          width: 56,
                          height: 75,
                          objectFit: "cover",
                          border: `2px solid ${live.color}66`,
                          display: "block",
                          imageRendering: "auto",
                        }}
                      />
                    </div>
                  )}
                  <div
                    className="flex items-center justify-between"
                    style={{ flex: 1, minWidth: 0 }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span
                          style={{
                            fontFamily: "'Press Start 2P', monospace",
                            fontSize: "8px",
                            color: live.color,
                          }}
                        >
                          {live.date}
                        </span>
                        <span
                          style={{
                            fontFamily: "'Press Start 2P', monospace",
                            fontSize: "6px",
                            color:
                              live.status === "UPCOMING" ? "#00e676" : "#555",
                            border: `1px solid ${live.status === "UPCOMING" ? "#00e676" : "#555"}`,
                            padding: "1px 4px",
                          }}
                        >
                          {live.status}
                        </span>
                      </div>
                      <div
                        style={{
                          fontFamily: "'Press Start 2P', monospace",
                          fontSize: "9px",
                          color: "#ffffff",
                          marginBottom: "4px",
                        }}
                      >
                        {live.name}
                      </div>
                      <div
                        style={{
                          fontFamily: "'Noto Sans JP', sans-serif",
                          fontSize: "12px",
                          color: "#aaaaaa",
                        }}
                      >
                        {live.venue}
                      </div>
                    </div>
                    {live.status === "UPCOMING" && live.ticketUrl && (
                      <a
                        href={live.ticketUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-3 px-3 py-2"
                        style={{
                          fontFamily: "'Press Start 2P', monospace",
                          fontSize: "7px",
                          color: live.color,
                          border: `2px solid ${live.color}`,
                          background: "transparent",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                          textDecoration: "none",
                          display: "inline-block",
                        }}
                        onMouseEnter={e => {
                          (
                            e.currentTarget as HTMLAnchorElement
                          ).style.background = live.color;
                          (e.currentTarget as HTMLAnchorElement).style.color =
                            "#000";
                        }}
                        onMouseLeave={e => {
                          (
                            e.currentTarget as HTMLAnchorElement
                          ).style.background = "transparent";
                          (e.currentTarget as HTMLAnchorElement).style.color =
                            live.color;
                        }}
                      >
                        TICKET
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <CloseButton onClose={onClose} color="#ff6d00" />
          </div>
        </PixelBorder>
      </div>
    </div>
  );
}

function ContactModal({ onClose }: { onClose: () => void }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: "rgba(0,0,0,0.85)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s",
      }}
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 60,
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "14px",
          color: "#000",
          background: "#00e676",
          border: "3px solid #00e676",
          width: 44,
          height: 44,
          cursor: "pointer",
          boxShadow: "0 0 20px #00e67688",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: 1,
        }}
      >
        ✕
      </button>
      <div style={{ maxWidth: 560, width: "100%" }}>
        <PixelBorder color="#00e676">
          <div
            className="p-6"
            style={{ maxHeight: "85dvh", overflowY: "auto" }}
          >
            <div className="text-center mb-6">
              <div
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: "14px",
                  color: "#00e676",
                  textShadow: "0 0 10px #00e676",
                  letterSpacing: "2px",
                  marginBottom: "8px",
                }}
              >
                ✉ CONTACT ✉
              </div>
              <div
                style={{
                  color: "#ffffff88",
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: "8px",
                }}
              >
                BOSS DEFEATED! COMMUNICATION OPEN
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {[
                {
                  label: "CONTACT",
                  value: "senseofdefeat@gmail.com",
                  icon: "♦",
                },
              ].map(item => (
                <div
                  key={item.label}
                  className="p-3 flex items-center gap-4"
                  style={{
                    border: "1px solid #00e67644",
                    background: "#00e6760a",
                  }}
                >
                  <span
                    style={{
                      color: "#00e676",
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: "10px",
                    }}
                  >
                    {item.icon}
                  </span>
                  <div>
                    <div
                      style={{
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: "7px",
                        color: "#00e676",
                        marginBottom: "4px",
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Noto Sans JP', sans-serif",
                        fontSize: "13px",
                        color: "#e0e0e0",
                      }}
                    >
                      {item.value}
                    </div>
                  </div>
                </div>
              ))}

              <div
                className="p-3 text-center"
                style={{
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: "12px",
                  color: "#e0e0e0",
                  lineHeight: "1.6",
                }}
              >
                ※各種SNSのDMでも連絡を受け付けています。
              </div>
            </div>

            <div
              className="p-4 mb-6 text-center"
              style={{
                border: "1px solid #00e67622",
                background: "#00e6760a",
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "8px",
                color: "#00e676",
                lineHeight: "2",
              }}
            >
              CONGRATULATIONS!
              <br />
              YOU COMPLETED THE STAGE!
              <br />
              <span style={{ color: "#ffdd00" }}>★★★ PERFECT CLEAR ★★★</span>
            </div>

            <CloseButton onClose={onClose} color="#00e676" />
          </div>
        </PixelBorder>
      </div>
    </div>
  );
}

function CloseButton({
  onClose,
  color,
}: {
  onClose: () => void;
  color: string;
}) {
  return (
    <div className="text-center">
      <button
        onClick={onClose}
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "11px",
          color: "#000",
          border: `3px solid ${color}`,
          background: color,
          padding: "12px 32px",
          cursor: "pointer",
          boxShadow: `0 0 20px ${color}88`,
          transition: "all 0.1s",
          letterSpacing: "1px",
        }}
        onMouseEnter={e => {
          (e.target as HTMLButtonElement).style.background = "transparent";
          (e.target as HTMLButtonElement).style.color = color;
          (e.target as HTMLButtonElement).style.boxShadow = `0 0 30px ${color}`;
        }}
        onMouseLeave={e => {
          (e.target as HTMLButtonElement).style.background = color;
          (e.target as HTMLButtonElement).style.color = "#000";
          (e.target as HTMLButtonElement).style.boxShadow =
            `0 0 20px ${color}88`;
        }}
      >
        ✕ CLOSE
      </button>
      <div
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "7px",
          color: "#ffffff33",
          marginTop: "8px",
        }}
      >
        ESC / Z key also works
      </div>
    </div>
  );
}

export function GameModal({ type, onClose }: GameModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "KeyZ" || e.code === "Escape" || e.code === "Enter") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (type === "profile") return <ProfileModal onClose={onClose} />;
  if (type === "discography") return <DiscographyModal onClose={onClose} />;
  if (type === "live") return <LiveModal onClose={onClose} />;
  if (type === "info") return <ContactModal onClose={onClose} />;
  return null;
}
