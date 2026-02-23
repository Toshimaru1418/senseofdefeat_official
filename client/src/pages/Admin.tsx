/**
 * SENSE OF DEFEAT - Admin Panel
 * Password-protected admin panel for managing live events and discography
 * Design: Retro pixel art style matching the game aesthetic
 */

import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import { useLocation } from "wouter";

// ---- Types ----
type LiveEvent = {
  id: number;
  eventDate: string;
  venueName: string;
  venueCity?: string | null;
  eventTitle?: string | null;
  ticketUrl?: string | null;
  detailUrl?: string | null;
  isPublished: boolean;
  sortOrder: number;
};

type DiscographyItem = {
  id: number;
  title: string;
  releaseYear: number;
  releaseDate?: string | null;
  type: "single" | "ep" | "album" | "mini_album";
  streamingUrl?: string | null;
  downloadUrl?: string | null;
  coverImageUrl?: string | null;
  description?: string | null;
  isPublished: boolean;
  sortOrder: number;
};

// ---- Pixel Art Styles ----
const pixelFont = "'Press Start 2P', monospace";
const colors = {
  bg: "#0a0a0f",
  panel: "#12121a",
  border: "#00e5ff44",
  borderBright: "#00e5ff",
  text: "#e0e0e0",
  textDim: "#888",
  accent: "#00e5ff",
  accentGreen: "#00e676",
  accentRed: "#ff1744",
  accentOrange: "#ff6d00",
  accentPurple: "#aa00ff",
  inputBg: "#1a1a2e",
  buttonBg: "#00e5ff22",
};

const styles = {
  container: {
    minHeight: "100vh",
    background: colors.bg,
    color: colors.text,
    fontFamily: "'Noto Sans JP', sans-serif",
    padding: "0",
  } as React.CSSProperties,
  header: {
    background: colors.panel,
    borderBottom: `2px solid ${colors.border}`,
    padding: "12px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky" as const,
    top: 0,
    zIndex: 100,
  } as React.CSSProperties,
  headerTitle: {
    fontFamily: pixelFont,
    fontSize: "10px",
    color: colors.accent,
    textShadow: `0 0 10px ${colors.accent}`,
    letterSpacing: "2px",
  } as React.CSSProperties,
  nav: {
    display: "flex",
    gap: "8px",
  } as React.CSSProperties,
  navBtn: (active: boolean) => ({
    fontFamily: pixelFont,
    fontSize: "7px",
    color: active ? colors.bg : colors.accent,
    background: active ? colors.accent : colors.buttonBg,
    border: `1px solid ${active ? colors.accent : colors.border}`,
    padding: "6px 12px",
    cursor: "pointer",
    transition: "all 0.15s",
    letterSpacing: "1px",
  } as React.CSSProperties),
  content: {
    padding: "24px",
    maxWidth: "1200px",
    margin: "0 auto",
  } as React.CSSProperties,
  card: {
    background: colors.panel,
    border: `1px solid ${colors.border}`,
    padding: "20px",
    marginBottom: "16px",
  } as React.CSSProperties,
  cardTitle: {
    fontFamily: pixelFont,
    fontSize: "8px",
    color: colors.accent,
    marginBottom: "16px",
    letterSpacing: "2px",
    borderBottom: `1px solid ${colors.border}`,
    paddingBottom: "8px",
  } as React.CSSProperties,
  input: {
    background: colors.inputBg,
    border: `1px solid ${colors.border}`,
    color: colors.text,
    padding: "8px 12px",
    fontSize: "13px",
    width: "100%",
    boxSizing: "border-box" as const,
    outline: "none",
    fontFamily: "'Noto Sans JP', sans-serif",
  } as React.CSSProperties,
  label: {
    display: "block",
    fontSize: "11px",
    color: colors.textDim,
    marginBottom: "4px",
    fontFamily: pixelFont,
    letterSpacing: "1px",
  } as React.CSSProperties,
  btn: (variant: "primary" | "danger" | "success" | "secondary") => {
    const variantColors = {
      primary: { bg: colors.buttonBg, border: colors.accent, text: colors.accent },
      danger: { bg: "#ff174422", border: colors.accentRed, text: colors.accentRed },
      success: { bg: "#00e67622", border: colors.accentGreen, text: colors.accentGreen },
      secondary: { bg: "#ffffff11", border: "#ffffff33", text: "#ffffff88" },
    };
    const c = variantColors[variant];
    return {
      background: c.bg,
      border: `1px solid ${c.border}`,
      color: c.text,
      padding: "6px 14px",
      cursor: "pointer",
      fontFamily: pixelFont,
      fontSize: "7px",
      letterSpacing: "1px",
      transition: "all 0.15s",
    } as React.CSSProperties;
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  } as React.CSSProperties,
  formGroup: {
    marginBottom: "12px",
  } as React.CSSProperties,
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    fontSize: "12px",
  } as React.CSSProperties,
  th: {
    fontFamily: pixelFont,
    fontSize: "7px",
    color: colors.textDim,
    padding: "8px",
    textAlign: "left" as const,
    borderBottom: `1px solid ${colors.border}`,
    letterSpacing: "1px",
  } as React.CSSProperties,
  td: {
    padding: "10px 8px",
    borderBottom: `1px solid ${colors.border}22`,
    verticalAlign: "top" as const,
  } as React.CSSProperties,
};

// ---- Password Login Screen ----
function PasswordLogin({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const verifyMutation = trpc.admin.verifyPassword.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const result = await verifyMutation.mutateAsync({ password });
      if (result.success) {
        sessionStorage.setItem("admin_verified", "true");
        onSuccess();
      } else {
        setError("パスワードが違います");
      }
    } catch {
      setError("エラーが発生しました");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: colors.bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{ width: "360px" }}>
        <div style={{
          fontFamily: pixelFont,
          fontSize: "10px",
          color: colors.accent,
          textAlign: "center",
          marginBottom: "8px",
          textShadow: `0 0 10px ${colors.accent}`,
          letterSpacing: "2px",
        }}>
          ADMIN PANEL
        </div>
        <div style={{
          fontFamily: pixelFont,
          fontSize: "7px",
          color: colors.textDim,
          textAlign: "center",
          marginBottom: "32px",
          letterSpacing: "1px",
        }}>
          SENSE OF DEFEAT
        </div>
        <div style={styles.card}>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={styles.input}
                placeholder="管理者パスワードを入力"
                autoFocus
              />
            </div>
            {error && (
              <div style={{
                color: colors.accentRed,
                fontSize: "11px",
                marginBottom: "12px",
                fontFamily: pixelFont,
                letterSpacing: "1px",
              }}>
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={verifyMutation.isPending}
              style={{
                ...styles.btn("primary"),
                width: "100%",
                padding: "10px",
                fontSize: "8px",
              }}
            >
              {verifyMutation.isPending ? "CHECKING..." : "LOGIN"}
            </button>
          </form>
          <div style={{
            marginTop: "16px",
            fontSize: "10px",
            color: colors.textDim,
            textAlign: "center",
          }}>
            ※ 初期パスワード: sod2024admin
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <a href="/" style={{
            fontFamily: pixelFont,
            fontSize: "7px",
            color: colors.textDim,
            textDecoration: "none",
            letterSpacing: "1px",
          }}>
            ← BACK TO SITE
          </a>
        </div>
      </div>
    </div>
  );
}

// ---- Live Events Manager ----
function LiveEventsManager() {
  const utils = trpc.useUtils();
  const { data: events = [], isLoading } = trpc.liveEvents.listAll.useQuery();
  const createMutation = trpc.liveEvents.create.useMutation({
    onSuccess: () => {
      utils.liveEvents.listAll.invalidate();
      utils.liveEvents.list.invalidate();
      toast.success("ライブ情報を追加しました");
      setForm(defaultForm);
      setShowForm(false);
      setFlyerPreview(null);
    },
    onError: (e) => toast.error("エラー: " + e.message),
  });
  const updateMutation = trpc.liveEvents.update.useMutation({
    onSuccess: () => {
      utils.liveEvents.listAll.invalidate();
      utils.liveEvents.list.invalidate();
      toast.success("更新しました");
      setEditId(null);
      setForm(defaultForm);
      setFlyerPreview(null);
    },
    onError: (e) => toast.error("エラー: " + e.message),
  });
  const deleteMutation = trpc.liveEvents.delete.useMutation({
    onSuccess: () => {
      utils.liveEvents.listAll.invalidate();
      utils.liveEvents.list.invalidate();
      toast.success("削除しました");
    },
    onError: (e) => toast.error("エラー: " + e.message),
  });
  const uploadFlyerMutation = trpc.liveEvents.uploadFlyer.useMutation({
    onError: (e) => toast.error("アップロードエラー: " + e.message),
  });

  const defaultForm = {
    eventDate: "",
    venueName: "",
    venueCity: "",
    eventTitle: "",
    ticketUrl: "",
    detailUrl: "",
    flyerImageUrl: "",
    flyerImageKey: "",
    isPublished: true,
    sortOrder: 0,
  };

  const [form, setForm] = useState(defaultForm);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [flyerPreview, setFlyerPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleEdit = (event: LiveEvent & { flyerImageUrl?: string | null; flyerImageKey?: string | null }) => {
    setEditId(event.id);
    setForm({
      eventDate: event.eventDate,
      venueName: event.venueName,
      venueCity: event.venueCity ?? "",
      eventTitle: event.eventTitle ?? "",
      ticketUrl: event.ticketUrl ?? "",
      detailUrl: event.detailUrl ?? "",
      flyerImageUrl: event.flyerImageUrl ?? "",
      flyerImageKey: event.flyerImageKey ?? "",
      isPublished: event.isPublished,
      sortOrder: event.sortOrder,
    });
    setFlyerPreview(event.flyerImageUrl ?? null);
    setShowForm(true);
  };

  const handleFlyerFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("ファイルサイズは5MB以下にしてください");
      return;
    }
    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => setFlyerPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
    // Upload to S3
    setIsUploading(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => {
          const result = r.result as string;
          resolve(result.split(",")[1]); // strip data URL prefix
        };
        r.onerror = reject;
        r.readAsDataURL(file);
      });
      const { url, key } = await uploadFlyerMutation.mutateAsync({
        fileName: file.name,
        fileBase64: base64,
        mimeType: file.type,
      });
      setForm(f => ({ ...f, flyerImageUrl: url, flyerImageKey: key }));
      toast.success("フライヤー画像をアップロードしました");
    } catch {
      setFlyerPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFlyer = () => {
    setFlyerPreview(null);
    setForm(f => ({ ...f, flyerImageUrl: "", flyerImageKey: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...form,
      venueCity: form.venueCity || undefined,
      eventTitle: form.eventTitle || undefined,
      ticketUrl: form.ticketUrl || undefined,
      detailUrl: form.detailUrl || undefined,
      flyerImageUrl: form.flyerImageUrl || undefined,
      flyerImageKey: form.flyerImageKey || undefined,
    };
    if (editId !== null) {
      await updateMutation.mutateAsync({ id: editId, ...data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditId(null);
    setForm(defaultForm);
    setFlyerPreview(null);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div style={styles.cardTitle}>LIVE EVENTS</div>
        {!showForm && (
          <button
            onClick={() => { setShowForm(true); setEditId(null); setForm(defaultForm); }}
            style={styles.btn("success")}
          >
            + ADD EVENT
          </button>
        )}
      </div>

      {showForm && (
        <div style={{ ...styles.card, marginBottom: "20px", borderColor: colors.accentGreen + "66" }}>
          <div style={{ ...styles.cardTitle, color: colors.accentGreen }}>
            {editId ? "EDIT EVENT" : "NEW EVENT"}
          </div>
          <form onSubmit={handleSubmit}>
            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>DATE *</label>
                <input
                  type="date"
                  value={form.eventDate}
                  onChange={e => setForm(f => ({ ...f, eventDate: e.target.value }))}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>VENUE *</label>
                <input
                  type="text"
                  value={form.venueName}
                  onChange={e => setForm(f => ({ ...f, venueName: e.target.value }))}
                  style={styles.input}
                  placeholder="会場名"
                  required
                />
              </div>
            </div>
            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>CITY</label>
                <input
                  type="text"
                  value={form.venueCity}
                  onChange={e => setForm(f => ({ ...f, venueCity: e.target.value }))}
                  style={styles.input}
                  placeholder="都市名（例: 熊谷, 東京）"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>EVENT TITLE</label>
                <input
                  type="text"
                  value={form.eventTitle}
                  onChange={e => setForm(f => ({ ...f, eventTitle: e.target.value }))}
                  style={styles.input}
                  placeholder="イベント名"
                />
              </div>
            </div>
            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>TICKET URL</label>
                <input
                  type="url"
                  value={form.ticketUrl}
                  onChange={e => setForm(f => ({ ...f, ticketUrl: e.target.value }))}
                  style={styles.input}
                  placeholder="https://..."
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>DETAIL URL</label>
                <input
                  type="url"
                  value={form.detailUrl}
                  onChange={e => setForm(f => ({ ...f, detailUrl: e.target.value }))}
                  style={styles.input}
                  placeholder="https://..."
                />
              </div>
            </div>
            {/* Flyer Image Upload */}
            <div style={{ marginBottom: "12px" }}>
              <label style={styles.label}>FLYER IMAGE</label>
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", flexWrap: "wrap" }}>
                {flyerPreview && (
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <img
                      src={flyerPreview}
                      alt="Flyer preview"
                      style={{ width: 120, height: 160, objectFit: "cover", border: `1px solid ${colors.border}`, display: "block" }}
                    />
                    <button
                      type="button"
                      onClick={handleRemoveFlyer}
                      style={{
                        position: "absolute", top: 2, right: 2,
                        background: colors.accentRed, color: "#fff",
                        border: "none", width: 20, height: 20,
                        cursor: "pointer", fontSize: "12px", lineHeight: "20px", textAlign: "center",
                      }}
                    >×</button>
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label
                    style={{
                      ...styles.btn("primary"),
                      cursor: isUploading ? "not-allowed" : "pointer",
                      opacity: isUploading ? 0.6 : 1,
                      display: "inline-block",
                    }}
                  >
                    {isUploading ? "UPLOADING..." : (flyerPreview ? "CHANGE IMAGE" : "UPLOAD FLYER")}
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      disabled={isUploading}
                      onChange={handleFlyerFileChange}
                    />
                  </label>
                  <span style={{ fontSize: "10px", color: colors.textDim }}>JPG/PNG/WEBP ・ 5MB以下</span>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "12px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "12px" }}>
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={e => setForm(f => ({ ...f, isPublished: e.target.checked }))}
                />
                公開する
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "11px", color: colors.textDim }}>並び順:</span>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={e => setForm(f => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))}
                  style={{ ...styles.input, width: "80px" }}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending || isUploading}
                style={styles.btn("success")}
              >
                {(createMutation.isPending || updateMutation.isPending) ? "SAVING..." : (editId ? "UPDATE" : "CREATE")}
              </button>
              <button type="button" onClick={handleCancel} style={styles.btn("secondary")}>
                CANCEL
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div style={{ color: colors.textDim, fontFamily: pixelFont, fontSize: "8px" }}>LOADING...</div>
      ) : events.length === 0 ? (
        <div style={{ color: colors.textDim, fontSize: "13px", padding: "20px 0" }}>
          ライブ情報がありません。「ADD EVENT」から追加してください。
        </div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>DATE</th>
              <th style={styles.th}>VENUE</th>
              <th style={styles.th}>TITLE</th>
              <th style={styles.th}>FLYER</th>
              <th style={styles.th}>STATUS</th>
              <th style={styles.th}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td style={styles.td}>{event.eventDate}</td>
                <td style={styles.td}>
                  <div>{event.venueName}</div>
                  {event.venueCity && <div style={{ color: colors.textDim, fontSize: "11px" }}>{event.venueCity}</div>}
                </td>
                <td style={styles.td}>{event.eventTitle ?? "-"}</td>
                <td style={styles.td}>
                  {(event as any).flyerImageUrl ? (
                    <img
                      src={(event as any).flyerImageUrl}
                      alt="flyer"
                      style={{ width: 40, height: 54, objectFit: "cover", border: `1px solid ${colors.border}` }}
                    />
                  ) : (
                    <span style={{ color: colors.textDim, fontSize: "10px" }}>-</span>
                  )}
                </td>
                <td style={styles.td}>
                  <span style={{
                    fontFamily: pixelFont,
                    fontSize: "6px",
                    color: event.isPublished ? colors.accentGreen : colors.textDim,
                    border: `1px solid ${event.isPublished ? colors.accentGreen : colors.textDim}`,
                    padding: "2px 6px",
                  }}>
                    {event.isPublished ? "PUBLIC" : "HIDDEN"}
                  </span>
                </td>
                <td style={styles.td}>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button onClick={() => handleEdit(event)} style={styles.btn("primary")}>EDIT</button>
                    <button
                      onClick={() => {
                        if (confirm(`「${event.venueName}」を削除しますか？`)) {
                          deleteMutation.mutate({ id: event.id });
                        }
                      }}
                      style={styles.btn("danger")}
                    >
                      DEL
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ---- Discography Manager ----
function DiscographyManager() {
  const utils = trpc.useUtils();
  const { data: items = [], isLoading } = trpc.discography.listAll.useQuery();
  const createMutation = trpc.discography.create.useMutation({
    onSuccess: () => {
      utils.discography.listAll.invalidate();
      utils.discography.list.invalidate();
      toast.success("ディスコグラフィーを追加しました");
      setForm(defaultForm);
      setShowForm(false);
    },
    onError: (e) => toast.error("エラー: " + e.message),
  });
  const updateMutation = trpc.discography.update.useMutation({
    onSuccess: () => {
      utils.discography.listAll.invalidate();
      utils.discography.list.invalidate();
      toast.success("更新しました");
      setEditId(null);
      setForm(defaultForm);
    },
    onError: (e) => toast.error("エラー: " + e.message),
  });
  const deleteMutation = trpc.discography.delete.useMutation({
    onSuccess: () => {
      utils.discography.listAll.invalidate();
      utils.discography.list.invalidate();
      toast.success("削除しました");
    },
    onError: (e) => toast.error("エラー: " + e.message),
  });

  const defaultForm = {
    title: "",
    releaseYear: new Date().getFullYear(),
    releaseDate: "",
    type: "single" as "single" | "ep" | "album" | "mini_album",
    streamingUrl: "",
    downloadUrl: "",
    coverImageUrl: "",
    description: "",
    isPublished: true,
    sortOrder: 0,
  };

  const [form, setForm] = useState(defaultForm);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const handleEdit = (item: DiscographyItem) => {
    setEditId(item.id);
    setForm({
      title: item.title,
      releaseYear: item.releaseYear,
      releaseDate: item.releaseDate ?? "",
      type: item.type,
      streamingUrl: item.streamingUrl ?? "",
      downloadUrl: item.downloadUrl ?? "",
      coverImageUrl: item.coverImageUrl ?? "",
      description: item.description ?? "",
      isPublished: item.isPublished,
      sortOrder: item.sortOrder,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...form,
      releaseDate: form.releaseDate || undefined,
      streamingUrl: form.streamingUrl || undefined,
      downloadUrl: form.downloadUrl || undefined,
      coverImageUrl: form.coverImageUrl || undefined,
      description: form.description || undefined,
    };
    if (editId !== null) {
      await updateMutation.mutateAsync({ id: editId, ...data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditId(null);
    setForm(defaultForm);
  };

  const typeLabels = { single: "Single", ep: "EP", album: "Album", mini_album: "Mini Album" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div style={styles.cardTitle}>DISCOGRAPHY</div>
        {!showForm && (
          <button
            onClick={() => { setShowForm(true); setEditId(null); setForm(defaultForm); }}
            style={styles.btn("success")}
          >
            + ADD RELEASE
          </button>
        )}
      </div>

      {showForm && (
        <div style={{ ...styles.card, marginBottom: "20px", borderColor: colors.accentPurple + "66" }}>
          <div style={{ ...styles.cardTitle, color: colors.accentPurple }}>
            {editId ? "EDIT RELEASE" : "NEW RELEASE"}
          </div>
          <form onSubmit={handleSubmit}>
            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>TITLE *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  style={styles.input}
                  placeholder="リリースタイトル"
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>TYPE</label>
                <select
                  value={form.type}
                  onChange={e => setForm(f => ({ ...f, type: e.target.value as typeof form.type }))}
                  style={{ ...styles.input }}
                >
                  <option value="single">Single</option>
                  <option value="ep">EP</option>
                  <option value="album">Album</option>
                  <option value="mini_album">Mini Album</option>
                </select>
              </div>
            </div>
            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>YEAR *</label>
                <input
                  type="number"
                  value={form.releaseYear}
                  onChange={e => setForm(f => ({ ...f, releaseYear: parseInt(e.target.value) || 2024 }))}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>RELEASE DATE</label>
                <input
                  type="date"
                  value={form.releaseDate}
                  onChange={e => setForm(f => ({ ...f, releaseDate: e.target.value }))}
                  style={styles.input}
                />
              </div>
            </div>
            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>STREAMING URL</label>
                <input
                  type="url"
                  value={form.streamingUrl}
                  onChange={e => setForm(f => ({ ...f, streamingUrl: e.target.value }))}
                  style={styles.input}
                  placeholder="https://linkco.re/..."
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>DOWNLOAD URL</label>
                <input
                  type="url"
                  value={form.downloadUrl}
                  onChange={e => setForm(f => ({ ...f, downloadUrl: e.target.value }))}
                  style={styles.input}
                  placeholder="https://..."
                />
              </div>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>COVER IMAGE URL</label>
              <input
                type="url"
                value={form.coverImageUrl}
                onChange={e => setForm(f => ({ ...f, coverImageUrl: e.target.value }))}
                style={styles.input}
                placeholder="https://..."
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>DESCRIPTION</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                style={{ ...styles.input, height: "80px", resize: "vertical" }}
                placeholder="説明文"
              />
            </div>
            <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "12px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "12px" }}>
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={e => setForm(f => ({ ...f, isPublished: e.target.checked }))}
                />
                公開する
              </label>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                style={styles.btn("success")}
              >
                {(createMutation.isPending || updateMutation.isPending) ? "SAVING..." : (editId ? "UPDATE" : "CREATE")}
              </button>
              <button type="button" onClick={handleCancel} style={styles.btn("secondary")}>
                CANCEL
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div style={{ color: colors.textDim, fontFamily: pixelFont, fontSize: "8px" }}>LOADING...</div>
      ) : items.length === 0 ? (
        <div style={{ color: colors.textDim, fontSize: "13px", padding: "20px 0" }}>
          ディスコグラフィーがありません。「ADD RELEASE」から追加してください。
        </div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>TITLE</th>
              <th style={styles.th}>TYPE</th>
              <th style={styles.th}>YEAR</th>
              <th style={styles.th}>STATUS</th>
              <th style={styles.th}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td style={styles.td}>{item.title}</td>
                <td style={styles.td}>
                  <span style={{
                    fontFamily: pixelFont,
                    fontSize: "6px",
                    color: colors.accentPurple,
                    border: `1px solid ${colors.accentPurple}`,
                    padding: "2px 6px",
                  }}>
                    {typeLabels[item.type]}
                  </span>
                </td>
                <td style={styles.td}>{item.releaseYear}</td>
                <td style={styles.td}>
                  <span style={{
                    fontFamily: pixelFont,
                    fontSize: "6px",
                    color: item.isPublished ? colors.accentGreen : colors.textDim,
                    border: `1px solid ${item.isPublished ? colors.accentGreen : colors.textDim}`,
                    padding: "2px 6px",
                  }}>
                    {item.isPublished ? "PUBLIC" : "HIDDEN"}
                  </span>
                </td>
                <td style={styles.td}>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button onClick={() => handleEdit(item)} style={styles.btn("primary")}>EDIT</button>
                    <button
                      onClick={() => {
                        if (confirm(`「${item.title}」を削除しますか？`)) {
                          deleteMutation.mutate({ id: item.id });
                        }
                      }}
                      style={styles.btn("danger")}
                    >
                      DEL
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ---- Settings Panel ----
function SettingsPanel() {
  const { user, logout } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const changePasswordMutation = trpc.admin.changePassword.useMutation({
    onSuccess: () => {
      toast.success("パスワードを変更しました");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (e) => toast.error("エラー: " + e.message),
  });

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("パスワードが一致しません");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("パスワードは6文字以上で入力してください");
      return;
    }
    await changePasswordMutation.mutateAsync({ newPassword });
  };

  return (
    <div>
      <div style={styles.cardTitle}>SETTINGS</div>
      <div style={styles.card}>
        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontSize: "12px", color: colors.textDim, marginBottom: "4px" }}>ログイン中のユーザー</div>
          <div style={{ fontSize: "14px" }}>{user?.name ?? "不明"}</div>
        </div>
        <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: "20px", marginBottom: "20px" }}>
          <div style={{ fontFamily: pixelFont, fontSize: "8px", color: colors.accent, marginBottom: "16px" }}>
            CHANGE ADMIN PASSWORD
          </div>
          <form onSubmit={handleChangePassword}>
            <div style={styles.formGroup}>
              <label style={styles.label}>NEW PASSWORD</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                style={styles.input}
                placeholder="新しいパスワード（6文字以上）"
                minLength={6}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>CONFIRM PASSWORD</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                style={styles.input}
                placeholder="パスワードを再入力"
              />
            </div>
            <button
              type="submit"
              disabled={changePasswordMutation.isPending}
              style={styles.btn("primary")}
            >
              {changePasswordMutation.isPending ? "SAVING..." : "CHANGE PASSWORD"}
            </button>
          </form>
        </div>
        <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: "20px" }}>
          <button
            onClick={() => {
              sessionStorage.removeItem("admin_verified");
              logout();
            }}
            style={styles.btn("danger")}
          >
            LOGOUT
          </button>
        </div>
      </div>
    </div>
  );
}

// ---- Main Admin Page ----
export default function AdminPage() {
  const { user, loading } = useAuth();
  const [section, setSection] = useState<"live" | "discography" | "settings">("live");
  const [isVerified, setIsVerified] = useState(() => {
    return sessionStorage.getItem("admin_verified") === "true";
  });

  // If not logged in, redirect to login
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: colors.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: pixelFont, fontSize: "8px", color: colors.textDim }}>LOADING...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", background: colors.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: pixelFont, fontSize: "8px", color: colors.textDim, marginBottom: "16px" }}>
            管理ページにアクセスするにはログインが必要です
          </div>
          <a
            href={getLoginUrl()}
            style={{
              ...styles.btn("primary"),
              display: "inline-block",
              textDecoration: "none",
            }}
          >
            LOGIN WITH MANUS
          </a>
          <div style={{ marginTop: "16px" }}>
            <a href="/" style={{ fontFamily: pixelFont, fontSize: "7px", color: colors.textDim, textDecoration: "none" }}>
              ← BACK TO SITE
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Check if user is admin
  if (user.role !== "admin") {
    return (
      <div style={{ minHeight: "100vh", background: colors.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: pixelFont, fontSize: "8px", color: colors.accentRed, marginBottom: "8px" }}>
            ACCESS DENIED
          </div>
          <div style={{ fontSize: "13px", color: colors.textDim, marginBottom: "16px" }}>
            管理者権限がありません
          </div>
          <a href="/" style={{ fontFamily: pixelFont, fontSize: "7px", color: colors.textDim, textDecoration: "none" }}>
            ← BACK TO SITE
          </a>
        </div>
      </div>
    );
  }

  // Show password verification for extra security
  if (!isVerified) {
    return <PasswordLogin onSuccess={() => setIsVerified(true)} />;
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.headerTitle}>ADMIN PANEL</div>
          <div style={{ fontFamily: pixelFont, fontSize: "6px", color: colors.textDim, marginTop: "2px" }}>
            SENSE OF DEFEAT
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={styles.nav}>
            <button onClick={() => setSection("live")} style={styles.navBtn(section === "live")}>
              LIVE
            </button>
            <button onClick={() => setSection("discography")} style={styles.navBtn(section === "discography")}>
              DISCO
            </button>
            <button onClick={() => setSection("settings")} style={styles.navBtn(section === "settings")}>
              SETTINGS
            </button>
          </div>
          <a
            href="/"
            style={{
              fontFamily: pixelFont,
              fontSize: "7px",
              color: colors.textDim,
              textDecoration: "none",
              border: `1px solid ${colors.border}`,
              padding: "5px 10px",
            }}
          >
            ← SITE
          </a>
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        <div style={styles.card}>
          {section === "live" && <LiveEventsManager />}
          {section === "discography" && <DiscographyManager />}
          {section === "settings" && <SettingsPanel />}
        </div>
      </div>
    </div>
  );
}
