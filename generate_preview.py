#!/usr/bin/env python3
"""
generate_preview.py
Genera screens-preview.html con 30 artboards:
  · 15 pantallas tema CLARO  (fondo #F8F7F4)
  · 15 pantallas tema OSCURO (fondo #121212)

Cada pantalla es una función independiente que recibe el dict de tema.
Ejecutar: python3 generate_preview.py  (desde mi-app/)
"""

# ── Cover URLs ────────────────────────────────────────────────────────────────
COV_A = "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/0b/4d/b6/0b4db6bd-2d40-55a5-1714-67f5c816294d/075679659644.jpg/600x600bb.jpg"
COV_B = "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/0b/67/3f/0b673fd4-5e49-fccd-6193-3076bef03f53/075679792389.jpg/600x600bb.jpg"
COV_C = "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/cd/23/30/cd23301a-6faa-466a-0bac-ed393cce80ad/075679615336.jpg/600x600bb.jpg"
COV_D = "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/72/63/51/726351e7-2016-48f3-07f8-0891c9eb5e53/075679624161.jpg/600x600bb.jpg"
COV_E = "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/71/5f/fc/715ffc50-c006-500b-ad3e-830a6a6bbc70/artwork.jpg/600x600bb.jpg"
COV_F = "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/31/70/da/3170da66-9280-ccd2-1f97-57d8a1996f9e/075679970930.jpg/600x600bb.jpg"
COV_G = "https://is1-ssl.mzstatic.com/image/thumb/Music/d8/66/cd/mzi.ppitbdsw.jpg/600x600bb.jpg"
COV_H = "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/b4/c3/e8/b4c3e867-a787-7662-d8a4-45b3a30deb54/mzi.dsikpckg.jpg/600x600bb.jpg"
COV_I = "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/d8/a7/6f/d8a76fed-bac7-3bdb-26ee-aeead3e7b9d1/075679944986.jpg/600x600bb.jpg"
COV_J = "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/00/65/ea/0065ea05-4d9a-69c9-906d-b04ddb9a2522/075679841001.jpg/600x600bb.jpg"

ALPHABET = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ")


# ── Theme tokens ──────────────────────────────────────────────────────────────
def mk_theme(mode: str) -> dict:
    if mode == "dark":
        return dict(
            mode="dark",
            bg="#121212", bg_alt="#1A1A1A",
            glass2="rgba(255,255,255,0.11)",
            glass3="rgba(255,255,255,0.18)",
            border="rgba(255,255,255,0.12)",
            border_bright="rgba(255,255,255,0.22)",
            tp="#FBFFFE",
            ts="rgba(251,255,254,0.55)",
            tm="rgba(251,255,254,0.28)",
            accent="#A30000",
            icon_bg="rgba(255,255,255,0.11)",
            icon_color="#FBFFFE",
            divider="rgba(255,255,255,0.08)",
            track_border="rgba(255,255,255,0.07)",
            sheet_bg="#1C1C1E",
            mini_bg="rgba(40,40,40,0.96)",
            mini_border="rgba(255,255,255,0.13)",
            mini_shadow="0 12px 28px rgba(0,0,0,0.55)",
            play_bg="#FBFFFE",
            play_icon="#121212",
            search_bg="rgba(255,255,255,0.09)",
            search_border="rgba(255,255,255,0.13)",
            toggle_off="rgba(255,255,255,0.14)",
        )
    return dict(
        mode="light",
        bg="#F8F7F4", bg_alt="#FFFFFF",
        glass2="rgba(255,255,255,0.82)",
        glass3="rgba(255,255,255,0.97)",
        border="rgba(0,0,0,0.07)",
        border_bright="rgba(0,0,0,0.14)",
        tp="#121212",
        ts="rgba(18,18,18,0.52)",
        tm="rgba(18,18,18,0.30)",
        accent="#A30000",
        icon_bg="rgba(0,0,0,0.07)",
        icon_color="#121212",
        divider="rgba(0,0,0,0.06)",
        track_border="rgba(0,0,0,0.055)",
        sheet_bg="#F8F7F4",
        mini_bg="rgba(255,255,255,0.88)",
        mini_border="rgba(0,0,0,0.08)",
        mini_shadow="0 12px 28px rgba(0,0,0,0.10)",
        play_bg="#121212",
        play_icon="#F8F7F4",
        search_bg="rgba(255,255,255,0.82)",
        search_border="rgba(0,0,0,0.10)",
        toggle_off="rgba(0,0,0,0.14)",
    )


# ── Shared components ─────────────────────────────────────────────────────────
def status_bar(t):
    return f"""<div style="height:44px;padding:0 24px;display:flex;align-items:center;
    justify-content:space-between;flex-shrink:0;color:{t['tp']}">
  <span style="font-size:15px;font-weight:600">9:41</span>
  <div style="display:flex;align-items:center;gap:5px">
    <ion-icon name="cellular-outline" style="font-size:15px"></ion-icon>
    <ion-icon name="wifi-outline" style="font-size:15px"></ion-icon>
    <ion-icon name="battery-half-outline" style="font-size:17px"></ion-icon>
  </div>
</div>"""


def home_ind(t):
    bg = "rgba(255,255,255,0.20)" if t["mode"] == "dark" else "rgba(0,0,0,0.18)"
    return f'<div style="width:134px;height:5px;border-radius:3px;background:{bg};margin:6px auto 10px"></div>'


def tab_carousel(t, active):
    """Top tab carousel exactly like original — baseline-aligned, active is 32px/800, inactive 16px/600."""
    tabs = ["Library", "Álbum", "Tracks", "Artista", "Playlist", "Ajustes"]
    items = ""
    for tab in tabs:
        if tab == active:
            items += (f'<div style="padding:0 10px 6px;display:flex;align-items:flex-end;flex-shrink:0">'
                      f'<span style="font-size:32px;line-height:34px;font-weight:800;'
                      f'color:{t["tp"]};white-space:nowrap;letter-spacing:-0.5px">{tab}</span></div>')
        else:
            items += (f'<div style="padding:0 10px 10px;display:flex;align-items:flex-end;flex-shrink:0">'
                      f'<span style="font-size:16px;line-height:20px;font-weight:600;'
                      f'color:{t["tm"]};white-space:nowrap">{tab}</span></div>')

    return f"""<div style="position:relative;flex-shrink:0;padding-top:4px">
  <div style="height:56px;padding:0 8px;display:flex;align-items:flex-end;gap:0;overflow:hidden">
    {items}
  </div>
  <div style="position:absolute;left:0;top:0;bottom:0;width:32px;
    background:linear-gradient(90deg,{t['bg']} 0%,transparent 100%);pointer-events:none"></div>
  <div style="position:absolute;right:0;top:0;bottom:0;width:80px;
    background:linear-gradient(270deg,{t['bg']} 0%,transparent 100%);pointer-events:none"></div>
  <div style="height:1px;background:{t['divider']};margin:0 18px"></div>
</div>"""


def mini_player(t):
    return f"""<div style="position:absolute;left:16px;right:16px;bottom:18px;height:68px;
    border-radius:24px;border:1px solid {t['mini_border']};padding:0 12px;
    display:flex;align-items:center;justify-content:space-between;
    background:{t['mini_bg']};box-shadow:{t['mini_shadow']};z-index:30;backdrop-filter:blur(20px)">
  <div style="display:flex;align-items:center;gap:12px;flex:1;min-width:0">
    <div style="width:48px;height:48px;border-radius:16px;overflow:hidden;
      border:1px solid {t['border']};flex-shrink:0">
      <img src="{COV_A}" style="width:100%;height:100%;object-fit:cover">
    </div>
    <div style="flex:1;min-width:0">
      <div style="font-size:15px;font-weight:800;color:{t['tp']};
        white-space:nowrap;overflow:hidden;text-overflow:ellipsis">No One Noticed</div>
      <div style="font-size:13px;font-weight:600;color:{t['ts']};
        white-space:nowrap;overflow:hidden;text-overflow:ellipsis">The Marías</div>
    </div>
  </div>
  <div style="width:42px;height:42px;border-radius:999px;background:{t['play_bg']};
    display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-left:12px">
    <ion-icon name="play" style="font-size:18px;color:{t['play_icon']};margin-left:2px"></ion-icon>
  </div>
</div>"""


def alpha_index(t):
    letters = "".join(
        f'<span style="font-size:9px;font-weight:500;color:{t["tm"]};line-height:1">{l}</span>'
        for l in ALPHABET
    )
    return f"""<div style="position:absolute;right:0;top:0;bottom:0;width:22px;
    display:flex;flex-direction:column;align-items:center;
    justify-content:space-between;padding:6px 0;z-index:10">{letters}</div>"""


def search_bar(t, placeholder):
    return f"""<div style="height:44px;border-radius:999px;border:1px solid {t['search_border']};
    background:{t['search_bg']};display:flex;align-items:center;padding:0 14px;gap:8px">
  <ion-icon name="search-outline" style="font-size:17px;color:{t['tm']}"></ion-icon>
  <span style="font-size:15px;color:{t['tm']};font-weight:400">{placeholder}</span>
</div>"""


def sq_toggle(t, on):
    bg = t["accent"] if on else t["toggle_off"]
    pos = "right:3px" if on else "left:3px"
    return (f'<div style="width:44px;height:26px;border-radius:13px;background:{bg};'
            f'position:relative;flex-shrink:0">'
            f'<div style="position:absolute;top:3px;{pos};width:20px;height:20px;'
            f'border-radius:10px;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,0.3)"></div></div>')


def icon_sq(t, icon_name, size=17, danger=False):
    bg = "rgba(163,0,0,0.10)" if danger else t["icon_bg"]
    color = "#A30000" if danger else t["icon_color"]
    return (f'<div style="width:38px;height:38px;border-radius:11px;background:{bg};'
            f'display:flex;align-items:center;justify-content:center;flex-shrink:0">'
            f'<ion-icon name="{icon_name}" style="font-size:{size}px;color:{color}"></ion-icon></div>')


# ─────────────────────────────────────────────────────────────────────────────
# SCREEN 1 — Library
# ─────────────────────────────────────────────────────────────────────────────
def screen_library(t):
    stack = f"""<div style="position:relative;width:172px;height:120px;flex-shrink:0">
  <img src="{COV_C}" style="position:absolute;left:0;top:10px;width:92px;height:92px;
    border-radius:13px;object-fit:cover;transform:rotate(-6deg);opacity:0.62;
    box-shadow:0 4px 12px rgba(0,0,0,0.20)">
  <img src="{COV_B}" style="position:absolute;left:18px;top:5px;width:92px;height:92px;
    border-radius:13px;object-fit:cover;transform:rotate(-2deg);opacity:0.80;
    box-shadow:0 4px 14px rgba(0,0,0,0.22)">
  <img src="{COV_A}" style="position:absolute;left:38px;top:0;width:100px;height:100px;
    border-radius:13px;object-fit:cover;box-shadow:0 6px 20px rgba(0,0,0,0.28)">
</div>"""

    mix_cards = ""
    for cov, title, sub in [(COV_B, "Indie Dreamy", "43 tracks"),
                             (COV_D, "Late Night", "28 tracks"),
                             (COV_F, "Bass Drop", "61 tracks")]:
        mix_cards += f"""<div style="width:110px;height:110px;border-radius:16px;overflow:hidden;
      position:relative;flex-shrink:0;background:{t['icon_bg']}">
  <img src="{cov}" style="width:100%;height:100%;object-fit:cover">
  <div style="position:absolute;bottom:0;left:0;right:0;height:55%;
    background:linear-gradient(transparent,rgba(0,0,0,0.76));
    padding:0 8px 7px;display:flex;flex-direction:column;justify-content:flex-end">
    <div style="font-size:11px;font-weight:800;color:#fff;line-height:1.2">{title}</div>
    <div style="font-size:9px;color:rgba(255,255,255,0.72);margin-top:1px">{sub}</div>
  </div>
</div>"""

    rhythm = ""
    for cov, name in [(COV_E, "Cariño"), (COV_F, "Scary M."), (COV_G, "Equinox"),
                      (COV_H, "Summit"), (COV_I, "Recess")]:
        rhythm += f"""<div style="width:56px;flex-shrink:0">
  <img src="{cov}" style="width:56px;height:56px;border-radius:12px;object-fit:cover;margin-bottom:4px">
  <div style="font-size:10px;font-weight:600;color:{t['tp']};white-space:nowrap;
    overflow:hidden;text-overflow:ellipsis">{name}</div>
</div>"""

    # Mix modal overlay (open state)
    modal = f"""<div style="position:absolute;inset:0;background:rgba(0,0,0,0.38);z-index:40"></div>
<div style="position:absolute;left:0;right:0;bottom:0;z-index:41;background:{t['sheet_bg']};
  border-radius:28px 28px 0 0;padding:0 16px 28px;
  box-shadow:0 -12px 40px rgba(0,0,0,0.30)">
  <div style="width:44px;height:5px;border-radius:3px;background:{t['border_bright']};
    margin:12px auto 14px"></div>
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
    <div style="display:flex;align-items:center;gap:10px">
      {icon_sq(t, "chevron-back-outline", 18)}
      <div>
        <div style="font-size:16px;font-weight:800;color:{t['tp']};letter-spacing:-0.4px">Mixes</div>
        <div style="font-size:11.5px;color:{t['ts']}">Recientes · 6 sugerencias</div>
      </div>
    </div>
  </div>
  <div style="display:flex;gap:10px;margin-bottom:10px">
    <div style="flex:1;height:112px;border-radius:16px;overflow:hidden;
      position:relative;background:{t['icon_bg']}">
      <img src="{COV_B}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">
      <div style="position:absolute;inset:0;background:linear-gradient(transparent,rgba(0,0,0,0.70))"></div>
      <div style="position:absolute;left:12px;right:12px;bottom:10px">
        <div style="font-size:13px;font-weight:800;color:#fff;line-height:1.2">Indie Dreamy</div>
        <div style="font-size:10px;color:rgba(255,255,255,0.72);margin-top:2px">43 tracks</div>
      </div>
    </div>
    <div style="width:116px;height:112px;border-radius:16px;overflow:hidden;
      position:relative;background:{t['icon_bg']}">
      <img src="{COV_D}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">
      <div style="position:absolute;inset:0;background:linear-gradient(transparent,rgba(0,0,0,0.70))"></div>
      <div style="position:absolute;left:10px;right:10px;bottom:10px">
        <div style="font-size:12px;font-weight:800;color:#fff;line-height:1.2">Late Night</div>
        <div style="font-size:9px;color:rgba(255,255,255,0.70);margin-top:2px">28 tracks</div>
      </div>
    </div>
  </div>
  <div style="display:flex;gap:10px">
    <div style="width:116px;height:112px;border-radius:16px;overflow:hidden;
      position:relative;background:{t['icon_bg']}">
      <img src="{COV_F}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">
      <div style="position:absolute;inset:0;background:linear-gradient(transparent,rgba(0,0,0,0.70))"></div>
      <div style="position:absolute;left:10px;right:10px;bottom:10px">
        <div style="font-size:12px;font-weight:800;color:#fff;line-height:1.2">Bass Drop</div>
        <div style="font-size:9px;color:rgba(255,255,255,0.70);margin-top:2px">61 tracks</div>
      </div>
    </div>
    <div style="flex:1;height:112px;border-radius:16px;
      border:1.5px dashed {t['border_bright']};
      display:flex;align-items:center;justify-content:center;background:{t['icon_bg']}">
      <div style="text-align:center">
        <ion-icon name="add-outline" style="font-size:22px;color:{t['ts']}"></ion-icon>
        <div style="font-size:11px;font-weight:700;color:{t['ts']};margin-top:5px">Crear mix</div>
      </div>
    </div>
  </div>
</div>"""

    return f"""{status_bar(t)}
{tab_carousel(t, "Library")}
<div style="flex:1;overflow:hidden;position:relative;padding-bottom:92px">
  <div style="padding:14px 16px 10px">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
      <span style="font-size:13px;font-weight:700;color:{t['tp']}">Reproduciendo</span>
      <span style="font-size:12px;font-weight:600;color:{t['ts']}">Ver todo ›</span>
    </div>
    <div style="border-radius:20px;border:1px solid {t['border']};padding:13px;
      background:{t['bg_alt']};box-shadow:0 4px 16px rgba(0,0,0,0.08);
      display:flex;align-items:center;gap:10px;overflow:hidden">
      {stack}
      <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:6px">
        <div style="background:{t['glass3']};border-radius:12px;padding:10px;
          border:1px solid {t['border']};box-shadow:0 2px 10px rgba(0,0,0,0.06)">
          <div style="font-size:12px;font-weight:800;color:{t['tp']};white-space:nowrap;
            overflow:hidden;text-overflow:ellipsis">No One Noticed</div>
          <div style="font-size:11px;color:{t['ts']};margin-top:2px">The Marías · Submarine</div>
          <div style="display:flex;gap:6px;margin-top:7px;flex-wrap:wrap">
            <span style="font-size:10px;font-weight:700;color:{t['accent']};
              border:1px solid rgba(163,0,0,0.35);border-radius:8px;padding:2px 8px">FLAC</span>
            <span style="font-size:10px;font-weight:700;color:{t['ts']};
              border:1px solid {t['border_bright']};border-radius:8px;padding:2px 8px">2021</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div style="padding:4px 16px 10px">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
      <span style="font-size:13px;font-weight:700;color:{t['tp']}">Mixes Recientes</span>
      <span style="font-size:12px;font-weight:600;color:{t['ts']}">Ver más ›</span>
    </div>
    <div style="display:flex;gap:10px;overflow:hidden">{mix_cards}</div>
  </div>
  <div style="padding:4px 16px 10px">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
      <span style="font-size:13px;font-weight:700;color:{t['tp']}">Rítmico</span>
      <span style="font-size:12px;font-weight:600;color:{t['ts']}">Ver más ›</span>
    </div>
    <div style="display:flex;gap:11px;overflow:hidden">{rhythm}</div>
  </div>
  {modal}
</div>
{mini_player(t)}"""


# ─────────────────────────────────────────────────────────────────────────────
# SCREEN 2 — Álbum
# ─────────────────────────────────────────────────────────────────────────────
def screen_album(t):
    def seg(cov, title, artist, year, active=False):
        ov = "rgba(0,0,0,0.36)" if active else "rgba(0,0,0,0.54)"
        h = "244px" if active else "196px"
        return f"""<div style="width:100%;height:{h};position:relative;overflow:hidden;flex-shrink:0">
  <img src="{cov}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">
  <div style="position:absolute;inset:0;background:{ov}"></div>
  <div style="position:absolute;bottom:0;left:0;right:24px;padding:12px 16px">
    <div style="font-size:20px;font-weight:800;color:#fff;line-height:1.15;
      text-shadow:0 1px 6px rgba(0,0,0,0.6);margin-bottom:3px">{title}</div>
    <div style="font-size:13px;font-weight:600;color:rgba(255,255,255,0.82);
      text-shadow:0 1px 4px rgba(0,0,0,0.5);margin-bottom:6px">{artist}</div>
    <div style="display:flex;gap:5px">
      <span style="font-size:9.5px;font-weight:700;color:rgba(255,255,255,0.90);
        border:1px solid rgba(255,255,255,0.40);border-radius:5px;padding:2px 6px">{year}</span>
      <span style="font-size:9.5px;font-weight:700;color:rgba(255,255,255,0.90);
        border:1px solid rgba(255,255,255,0.40);border-radius:5px;padding:2px 6px">EP</span>
    </div>
  </div>
</div>"""

    track_rows = ""
    for num, title in [("1","No One Noticed"),("2","Sienna"),("3","Heavy"),
                        ("4","Lejos de Ti"),("5","Nobody New")]:
        track_rows += f"""<div style="display:flex;align-items:center;padding:8px 16px;
  border-bottom:1px solid {t['divider']}">
  <span style="font-size:11px;font-weight:600;color:{t['tm']};width:18px;
    flex-shrink:0;margin-right:10px">{num}</span>
  <img src="{COV_A}" style="width:36px;height:36px;border-radius:7px;object-fit:cover;
    flex-shrink:0;margin-right:10px">
  <div style="flex:1;min-width:0">
    <div style="font-size:13px;font-weight:700;color:{t['tp']};overflow:hidden;
      text-overflow:ellipsis;white-space:nowrap">{title}</div>
    <div style="font-size:10.5px;color:{t['ts']};margin-top:1px">The Marías</div>
  </div>
</div>"""

    return f"""{status_bar(t)}
{tab_carousel(t, "Álbum")}
<div style="flex:1;overflow:hidden;position:relative">
  <div style="position:relative">
    {seg(COV_A,"Submarine","The Marías","2021",True)}
    {seg(COV_B,"CINEMA","The Marías","2023",False)}
    {alpha_index(t)}
  </div>
  <div style="position:absolute;bottom:0;left:0;right:0;background:{t['sheet_bg']};
    border-radius:22px 22px 0 0;padding:0 0 16px;
    box-shadow:0 -10px 34px rgba(0,0,0,0.22);z-index:20">
    <div style="width:38px;height:5px;border-radius:3px;background:{t['border_bright']};
      margin:10px auto 8px"></div>
    <div style="text-align:center;margin-bottom:10px">
      <span style="font-size:10.5px;font-weight:700;letter-spacing:1.1px;color:{t['tm']}">ÁLBUM</span>
    </div>
    <div style="display:flex;align-items:center;gap:13px;padding:0 16px;margin-bottom:10px">
      <img src="{COV_A}" style="width:52px;height:52px;border-radius:11px;object-fit:cover;
        box-shadow:0 4px 12px rgba(0,0,0,0.25);flex-shrink:0">
      <div style="flex:1;min-width:0">
        <div style="font-size:17px;font-weight:800;color:{t['tp']};
          letter-spacing:-0.5px;line-height:1.2">No One Noticed</div>
        <div style="font-size:12.5px;font-weight:600;color:{t['ts']};margin-top:2px">The Marías</div>
        <div style="display:flex;gap:5px;margin-top:5px;flex-wrap:wrap">
          <span style="font-size:9px;font-weight:700;color:{t['ts']};
            border:1px solid {t['border_bright']};border-radius:5px;padding:2px 6px">2021</span>
          <span style="font-size:9px;font-weight:700;color:{t['accent']};
            border:1px solid rgba(163,0,0,0.35);border-radius:5px;padding:2px 6px">FLAC</span>
          <span style="font-size:9px;font-weight:700;color:{t['accent']};
            border:1px solid rgba(163,0,0,0.35);border-radius:5px;padding:2px 6px">96 kHz</span>
        </div>
      </div>
    </div>
    <div style="display:flex;gap:10px;padding:0 16px;margin-bottom:8px">
      <div style="flex:1;height:40px;border-radius:12px;background:{t['accent']};
        display:flex;align-items:center;justify-content:center;gap:6px">
        <ion-icon name="play" style="font-size:14px;color:#fff"></ion-icon>
        <span style="font-size:13px;font-weight:700;color:#fff">Reproducir</span>
      </div>
      <div style="flex:1;height:40px;border-radius:12px;background:{t['icon_bg']};
        display:flex;align-items:center;justify-content:center;gap:6px">
        <ion-icon name="shuffle-outline" style="font-size:14px;color:{t['icon_color']}"></ion-icon>
        <span style="font-size:13px;font-weight:700;color:{t['tp']}">Mezclar</span>
      </div>
    </div>
    {track_rows}
  </div>
</div>
{mini_player(t)}"""


# ─────────────────────────────────────────────────────────────────────────────
# SCREEN 3 — Tracks  (sin duración)
# ─────────────────────────────────────────────────────────────────────────────
def screen_tracks(t):
    data = [
        (COV_A,"No One Noticed","The Marías"),
        (COV_A,"Sienna","The Marías"),
        (COV_B,"Heavy","The Marías"),
        (COV_A,"Lejos de Ti","The Marías"),
        (COV_C,"Nobody New","The Marías"),
        (COV_D,"No One Noticed (Ext.)","The Marías"),
        (COV_C,"Back To Me","The Marías"),
        (COV_E,"Cariño","The Marías"),
        (COV_F,"Scary Monsters","Skrillex"),
        (COV_G,"First of the Year","Skrillex"),
    ]
    rows = ""
    for cov, title, artist in data:
        rows += f"""<div style="display:flex;align-items:center;padding:7px 14px 7px 12px;
  min-height:58px;border-bottom:1px solid {t['track_border']}">
  <img src="{cov}" style="width:43px;height:43px;border-radius:10px;object-fit:cover;
    flex-shrink:0;margin-right:11px">
  <div style="flex:1;min-width:0">
    <div style="font-size:14px;font-weight:700;color:{t['tp']};overflow:hidden;
      text-overflow:ellipsis;white-space:nowrap;line-height:1.25">{title}</div>
    <div style="font-size:11.5px;font-weight:500;color:{t['ts']};margin-top:2px">{artist}</div>
  </div>
  <ion-icon name="ellipsis-horizontal" style="font-size:17px;color:{t['tm']};flex-shrink:0"></ion-icon>
</div>"""

    return f"""{status_bar(t)}
{tab_carousel(t, "Tracks")}
<div style="flex:1;overflow:hidden;position:relative;padding-bottom:92px">
  <div style="padding:6px 12px 10px">{search_bar(t, "Buscar pista…")}</div>
  <div style="position:relative;padding-right:22px">
    {rows}
    {alpha_index(t)}
  </div>
</div>
{mini_player(t)}"""


# ─────────────────────────────────────────────────────────────────────────────
# SCREEN 4 — Artista  (collage posicionado absolutamente)
# ─────────────────────────────────────────────────────────────────────────────
def screen_artista(t):
    # Each entry: (text, fontSize, fontWeight, color_key, x, y, rotation)
    entries = [
        ("Bon Iver",             50, 900, "tp",   12,   8, -2),
        ("Radiohead",            44, 900, "tp",  118,  50,  1),
        ("Massive Attack",       26, 700, "tp",   12,  90,  0),
        ("Tame Impala",          26, 700, "tp",  178, 122, -1),
        ("Beach House",          24, 700, "tp",   12, 145,  0),
        ("Cigarettes After Sex", 18, 600, "accent", 12, 190, 0),
        ("Portishead",           24, 700, "tp",  192, 180, -1),
        ("Sigur Rós",            18, 600, "accent", 210, 222, 1),
        ("Vampire Weekend",      18, 600, "accent", 12, 228, -1),
        ("James Blake",          24, 700, "tp",  142, 262,  0),
        ("Fleet Foxes",          18, 600, "accent", 12, 276, 1),
        ("Caribou",              16, 600, "accent", 12, 314, 0),
        ("Coldplay",             16, 600, "accent", 92, 308, -2),
        ("Hozier",               16, 600, "accent", 178, 312, 1),
        ("Lorde",                16, 600, "accent", 246, 334, 0),
        ("Nick Drake",           13, 500, "ts",  12, 346, 0),
        ("Oasis",                13, 500, "ts", 104, 346, 0),
        ("The XX",               13, 500, "ts", 172, 360, -1),
        ("Adele",                13, 500, "ts",  12, 376,  1),
        ("Daughter",             13, 500, "ts",  76, 390,  0),
        ("Ibeyi",                13, 500, "ts", 156, 390, -1),
        ("Kimbra",               13, 500, "ts", 214, 386,  1),
        ("Arca",                 10, 400, "tm",  12, 416,  0),
        ("Beach Boys",           10, 400, "tm",  54, 420,  0),
        ("Ultraísta",            10, 400, "tm", 132, 424,  0),
        ("Years & Years",        10, 400, "tm", 198, 424,  0),
        ("Zaz",                  10, 400, "tm", 300, 422,  0),
    ]

    words = ""
    for text, fs, fw, col_key, x, y, r in entries:
        color = t[col_key]
        ls = "-2px" if fw >= 900 else "-0.8px" if fw >= 700 else "0px"
        words += (f'<div style="position:absolute;left:{x}px;top:{y}px;'
                  f'transform:rotate({r}deg)">'
                  f'<span style="font-size:{fs}px;font-weight:{fw};color:{color};'
                  f'letter-spacing:{ls};line-height:1.05;white-space:nowrap">{text}</span></div>\n')

    az = "".join(
        f'<span style="font-size:11px;font-weight:500;color:{t["ts"]};line-height:1">{l}</span>'
        for l in ALPHABET
    )

    return f"""{status_bar(t)}
{tab_carousel(t, "Artista")}
<div style="flex:1;overflow:hidden;position:relative;padding-bottom:92px;display:flex;flex-direction:column">
  <div style="padding:6px 12px 10px">{search_bar(t, "Buscar artista…")}</div>
  <div style="flex:1;display:flex;flex-direction:row;overflow:hidden">
    <div style="flex:1;position:relative;overflow:hidden;margin:0 4px 0 14px">
      {words}
    </div>
    <div style="width:28px;padding:6px 0;display:flex;flex-direction:column;
      align-items:center;justify-content:space-between">{az}</div>
  </div>
</div>
{mini_player(t)}"""


# ─────────────────────────────────────────────────────────────────────────────
# SCREEN 5 — Playlist
# ─────────────────────────────────────────────────────────────────────────────
def screen_playlist(t):
    dots = ""
    for i in range(6):
        w = "16px" if i == 0 else "5px"
        bg = t["tp"] if i == 0 else ("rgba(255,255,255,0.22)" if t["mode"]=="dark" else "rgba(18,18,18,0.18)")
        dots += f'<div style="width:{w};height:5px;border-radius:999px;background:{bg}"></div>'

    track_rows = ""
    for cov, title, artist, active in [
        (COV_A,"No One Noticed","The Marías",True),
        (COV_A,"Sienna","The Marías",False),
        (COV_B,"Heavy","The Marías",False),
        (COV_C,"Nobody New","The Marías",False),
        (COV_F,"Scary Monsters","Skrillex",False),
    ]:
        vol = (f'<ion-icon name="volume-medium-outline" style="font-size:15px;color:{t["accent"]};'
               f'margin-left:8px;flex-shrink:0"></ion-icon>' if active else "")
        track_rows += f"""<div style="display:flex;align-items:center;padding:9px 0">
  <div style="width:50px;height:50px;border-radius:10px;overflow:hidden;flex-shrink:0;
    margin-right:14px;background:{t['icon_bg']}">
    <img src="{cov}" style="width:100%;height:100%;object-fit:cover">
  </div>
  <div style="flex:1;min-width:0">
    <div style="font-size:14px;font-weight:700;color:{t['tp']};overflow:hidden;
      text-overflow:ellipsis;white-space:nowrap">{title}</div>
    <div style="font-size:12px;font-weight:500;color:{t['ts']};margin-top:2px">{artist}</div>
  </div>
  {vol}
</div>"""

    return f"""{status_bar(t)}
{tab_carousel(t, "Playlist")}
<div style="flex:1;overflow:hidden;padding-bottom:92px">
  <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 20px">
    <span style="font-size:27px;font-weight:800;color:{t['tp']};letter-spacing:-0.5px">Playlist</span>
    <div style="width:34px;height:34px;border-radius:999px;background:{t['icon_bg']};
      display:flex;align-items:center;justify-content:center">
      <ion-icon name="add-outline" style="font-size:19px;color:{t['icon_color']}"></ion-icon>
    </div>
  </div>
  <div style="padding:0 20px">
    <div style="width:100%;height:326px;border-radius:22px;overflow:hidden;
      position:relative;background:{t['icon_bg']}">
      <img src="{COV_A}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">
      <div style="position:absolute;bottom:0;left:0;right:0;height:52%;
        background:linear-gradient(transparent,rgba(0,0,0,0.70))"></div>
      <div style="position:absolute;bottom:0;left:0;right:0;padding:0 18px 20px;
        display:flex;align-items:flex-end;justify-content:space-between">
        <div style="flex:1;margin-right:14px">
          <div style="font-size:21px;font-weight:800;color:#fff;letter-spacing:-0.4px;
            line-height:1.2;margin-bottom:4px;text-shadow:0 1px 4px rgba(0,0,0,0.5)">No One Noticed</div>
          <div style="font-size:13px;font-weight:600;color:rgba(255,255,255,0.82)">The Marías</div>
        </div>
        <div style="width:44px;height:44px;border-radius:22px;
          border:2px solid rgba(255,255,255,0.92);
          background:rgba(255,255,255,0.18);
          display:flex;align-items:center;justify-content:center;flex-shrink:0">
          <ion-icon name="play" style="font-size:18px;color:#fff;margin-left:2px"></ion-icon>
        </div>
      </div>
    </div>
  </div>
  <div style="display:flex;align-items:center;justify-content:center;gap:5px;padding:9px 0 4px">{dots}</div>
  <div style="padding:0 20px">{track_rows}</div>
</div>
{mini_player(t)}"""


# ─────────────────────────────────────────────────────────────────────────────
# SCREEN 6 — Ajustes
# ─────────────────────────────────────────────────────────────────────────────
def screen_settings(t):
    chev = f'<ion-icon name="chevron-forward-outline" style="font-size:15px;color:{t["tm"]}"></ion-icon>'

    def srow(icon, label, sub="", right="", last=False):
        border = "" if last else f"border-bottom:1px solid {t['divider']};"
        sub_h = f'<div style="font-size:11px;color:{t["tm"]};margin-top:1px">{sub}</div>' if sub else ""
        return f"""<div style="display:flex;align-items:center;padding:10px 14px;{border}gap:12px">
  {icon_sq(t, icon)}
  <div style="flex:1;min-width:0">
    <div style="font-size:14px;font-weight:600;color:{t['tp']}">{label}</div>{sub_h}
  </div>
  {right}
</div>"""

    crossfade = f"""<div style="padding:8px 14px 12px">
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:7px">
    <span style="font-size:13px;font-weight:600;color:{t['tp']}">Crossfade</span>
    <span style="font-size:13px;font-weight:700;color:{t['accent']}">3 s</span>
  </div>
  <div style="height:34px;display:flex;align-items:center;position:relative">
    <div style="position:absolute;left:0;right:0;height:4px;border-radius:2px;background:{t['icon_bg']}">
      <div style="width:35%;height:100%;border-radius:2px;background:{t['accent']}"></div>
    </div>
    <div style="position:absolute;left:calc(35% - 8px);width:16px;height:16px;border-radius:8px;
      border:2px solid {t['accent']};background:{t['bg_alt']};
      box-shadow:0 1px 6px rgba(163,0,0,0.30)"></div>
  </div>
</div>"""

    card_body = (srow("musical-note-outline","Mezcla automática","",sq_toggle(t,True))
               + srow("repeat-outline","Reproducción continua","",sq_toggle(t,False))
               + srow("time-outline","Mostrar duración","",sq_toggle(t,True),last=True)
               + crossfade)

    sort_rows = ""
    for opt, sel in [("Artista",True),("Título",False),("Recientes",False)]:
        dot = (f'<div style="width:8px;height:8px;border-radius:4px;background:{t["accent"]};flex-shrink:0"></div>'
               if sel else
               f'<div style="width:8px;height:8px;border-radius:4px;border:1.5px solid {t["ts"]};flex-shrink:0"></div>')
        last_b = "" if opt=="Recientes" else f"border-bottom:1px solid {t['divider']};"
        sort_rows += f'<div style="display:flex;align-items:center;padding:9px 14px;{last_b}"><span style="flex:1;font-size:14px;font-weight:600;color:{t["tp"]}">{opt}</span>{dot}</div>'

    return f"""{status_bar(t)}
{tab_carousel(t, "Ajustes")}
<div style="flex:1;overflow:hidden;padding:10px 16px 92px">
  <div style="font-size:25px;font-weight:800;color:{t['tp']};letter-spacing:-0.5px;margin-bottom:3px">Ajustes</div>
  <div style="font-size:11.5px;color:{t['ts']};margin-bottom:14px">Reproducción · Biblioteca · Apariencia</div>
  <div style="border-radius:18px;border:1px solid {t['border']};background:{t['bg_alt']};
    overflow:hidden;margin-bottom:10px;box-shadow:0 2px 10px rgba(0,0,0,0.07)">
    <div style="display:flex;align-items:center;padding:11px 14px;gap:12px;
      border-bottom:1px solid {t['divider']}">
      {icon_sq(t,"headset-outline")}
      <span style="font-size:14px;font-weight:700;color:{t['tp']};flex:1">Reproducción</span>
      <ion-icon name="chevron-down-outline" style="font-size:15px;color:{t['tm']}"></ion-icon>
    </div>
    {card_body}
  </div>
  <div style="border-radius:18px;border:1px solid {t['border']};background:{t['bg_alt']};
    overflow:hidden;margin-bottom:10px;box-shadow:0 2px 10px rgba(0,0,0,0.07)">
    <div style="display:flex;align-items:center;padding:11px 14px;gap:12px;
      border-bottom:1px solid {t['divider']}">
      {icon_sq(t,"funnel-outline",16)}
      <span style="font-size:14px;font-weight:700;color:{t['tp']};flex:1">Ordenar por</span>
      <ion-icon name="chevron-down-outline" style="font-size:15px;color:{t['tm']}"></ion-icon>
    </div>
    {sort_rows}
  </div>
  <div style="border-radius:18px;border:1px solid {t['border']};background:{t['bg_alt']};
    overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.07)">
    {srow("folder-outline","Carpetas de música","2 carpetas detectadas",chev,last=True)}
  </div>
</div>
{mini_player(t)}"""


# ─────────────────────────────────────────────────────────────────────────────
# SCREEN 7 — Player  (portada bien posicionada y centrada)
# ─────────────────────────────────────────────────────────────────────────────
def screen_player(t):
    # Bottom row: lyrics left, 3 accent icons center, queue right (like screenshot)
    # No share button — app is offline

    return f"""{status_bar(t)}
<div style="flex:1;display:flex;flex-direction:column;padding-bottom:10px">

  <!-- Header row -->
  <div style="display:flex;flex-direction:column;align-items:center;padding:2px 20px 8px">
    <div style="width:40px;height:5px;border-radius:3px;background:{t['border']};margin-bottom:12px"></div>
    <div style="display:flex;align-items:center;gap:8px;width:100%">
      <ion-icon name="chevron-back-outline" style="font-size:17px;color:{t['ts']}"></ion-icon>
      <span style="font-size:11.5px;font-weight:600;color:{t['tm']};letter-spacing:0.2px;
        flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">Submarine · The Marías</span>
      <ion-icon name="ellipsis-horizontal" style="font-size:17px;color:{t['ts']}"></ion-icon>
    </div>
  </div>

  <!-- Cover — pushed down like real app screenshot, large with shadow -->
  <div style="display:flex;align-items:center;justify-content:center;
    padding:20px 28px 20px;flex-shrink:0">
    <div style="width:320px;height:320px;border-radius:26px;overflow:hidden;
      box-shadow:0 28px 64px rgba(0,0,0,0.52),0 10px 28px rgba(0,0,0,0.32)">
      <img src="{COV_A}" style="width:100%;height:100%;object-fit:cover;display:block">
    </div>
  </div>

  <!-- Meta + controls -->
  <div style="flex:1;padding:0 22px;display:flex;flex-direction:column;justify-content:space-between">
    <div>
      <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:2px">
        <div style="flex:1;min-width:0;padding-right:10px">
          <div style="font-size:24px;font-weight:800;color:{t['tp']};
            letter-spacing:-0.5px;line-height:1.18">No One Noticed</div>
          <div style="font-size:15px;font-weight:600;color:{t['ts']};margin-top:3px">The Marías</div>
        </div>
        <div style="width:38px;height:38px;border-radius:19px;background:{t['icon_bg']};
          display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:4px">
          <ion-icon name="ellipsis-horizontal" style="font-size:18px;color:{t['ts']}"></ion-icon>
        </div>
      </div>
      <div style="display:flex;gap:6px;margin-bottom:10px;margin-top:10px;flex-wrap:wrap;align-items:center">
        <span style="font-size:10px;font-weight:700;color:{t['accent']};
          border:1px solid rgba(163,0,0,0.42);border-radius:6px;padding:2px 7px">FLAC</span>
        <span style="font-size:11px;font-weight:500;color:{t['ts']}">24-bit · 48 kHz</span>
      </div>
      <div style="margin-bottom:4px">
        <div style="width:100%;height:4px;border-radius:2px;background:{t['icon_bg']};margin-bottom:5px">
          <div style="width:38%;height:100%;border-radius:2px;background:{t['accent']}"></div>
        </div>
        <div style="display:flex;justify-content:space-between">
          <span style="font-size:10.5px;font-weight:600;color:{t['tm']};letter-spacing:0.3px">1:29</span>
          <span style="font-size:10.5px;font-weight:600;color:{t['tm']};letter-spacing:0.3px">3:56</span>
        </div>
      </div>
    </div>
    <div>
      <div style="display:flex;align-items:center;justify-content:space-between;
        padding:0 2px;margin-bottom:6px">
        <div style="width:44px;height:44px;display:flex;align-items:center;
          justify-content:center;opacity:0.46">
          <ion-icon name="shuffle-outline" style="font-size:22px;color:{t['tp']}"></ion-icon>
        </div>
        <div style="width:44px;height:44px;display:flex;align-items:center;justify-content:center">
          <ion-icon name="play-skip-back" style="font-size:26px;color:{t['tp']}"></ion-icon>
        </div>
        <div style="width:72px;height:72px;border-radius:36px;background:{t['play_bg']};
          display:flex;align-items:center;justify-content:center;
          box-shadow:0 8px 24px rgba(0,0,0,0.38)">
          <ion-icon name="pause" style="font-size:30px;color:{t['play_icon']}"></ion-icon>
        </div>
        <div style="width:44px;height:44px;display:flex;align-items:center;justify-content:center">
          <ion-icon name="play-skip-forward" style="font-size:26px;color:{t['tp']}"></ion-icon>
        </div>
        <div style="width:44px;height:44px;display:flex;align-items:center;
          justify-content:center;opacity:0.46">
          <ion-icon name="repeat-outline" style="font-size:22px;color:{t['tp']}"></ion-icon>
        </div>
      </div>
      <!-- Bottom icon row: lyrics | 3 accent DNA icons | queue -->
      <div style="display:flex;align-items:center;justify-content:space-between;
        padding:0 16px;margin-bottom:4px">
        <div style="width:40px;height:40px;border-radius:12px;
          display:flex;align-items:center;justify-content:center">
          <ion-icon name="musical-notes-outline" style="font-size:22px;color:{t['accent']}"></ion-icon>
        </div>
        <div style="display:flex;align-items:center;gap:10px">
          <div style="width:38px;height:38px;border-radius:12px;border:1px solid rgba(163,0,0,0.35);
            background:rgba(163,0,0,0.08);display:flex;align-items:center;justify-content:center">
            <ion-icon name="alert-outline" style="font-size:18px;color:{t['accent']}"></ion-icon>
          </div>
          <div style="width:38px;height:38px;border-radius:12px;border:1px solid rgba(163,0,0,0.35);
            background:rgba(163,0,0,0.08);display:flex;align-items:center;justify-content:center">
            <ion-icon name="git-branch-outline" style="font-size:18px;color:{t['accent']}"></ion-icon>
          </div>
          <div style="width:38px;height:38px;border-radius:12px;border:1px solid rgba(163,0,0,0.35);
            background:rgba(163,0,0,0.08);display:flex;align-items:center;justify-content:center">
            <ion-icon name="color-wand-outline" style="font-size:18px;color:{t['accent']}"></ion-icon>
          </div>
        </div>
        <div style="width:40px;height:40px;border-radius:12px;
          display:flex;align-items:center;justify-content:center">
          <ion-icon name="list-outline" style="font-size:22px;color:{t['ts']}"></ion-icon>
        </div>
      </div>


    </div>
  </div>
</div>
{home_ind(t)}"""


# ─────────────────────────────────────────────────────────────────────────────
# SCREEN 8 — All Albums
# ─────────────────────────────────────────────────────────────────────────────
def screen_all_albums(t):
    cards = ""
    for cov, title, artist in [
        (COV_A,"No One Noticed","The Marías"),
        (COV_A,"Sienna","The Marías"),
        (COV_B,"Heavy","The Marías"),
        (COV_C,"Back To Me","The Marías"),
        (COV_D,"No One Noticed (Ext.)","The Marías"),
        (COV_E,"Cariño","The Marías"),
        (COV_F,"Scary Monsters","Skrillex"),
        (COV_G,"First of the Year","Skrillex"),
        (COV_H,"Summit","Skrillex"),
        (COV_I,"Recess","Skrillex"),
        (COV_J,"Mumbai Power","Skrillex"),
        (COV_F,"Kill Everybody","Skrillex"),
    ]:
        cards += f"""<div style="width:31%;margin-bottom:14px">
  <img src="{cov}" style="width:100%;aspect-ratio:1;border-radius:12px;object-fit:cover;margin-bottom:5px">
  <div style="font-size:11px;font-weight:700;color:{t['tp']};overflow:hidden;
    text-overflow:ellipsis;white-space:nowrap">{title}</div>
  <div style="font-size:10px;color:{t['ts']};margin-top:2px">{artist}</div>
</div>"""

    return f"""{status_bar(t)}
<div style="height:50px;padding:0 16px;display:flex;align-items:center;
  justify-content:space-between;flex-shrink:0">
  <div style="width:32px;height:32px;border-radius:16px;background:{t['icon_bg']};
    display:flex;align-items:center;justify-content:center">
    <ion-icon name="chevron-back-outline" style="font-size:18px;color:{t['icon_color']}"></ion-icon>
  </div>
  <span style="font-size:19px;font-weight:700;color:{t['tp']}">All Albums</span>
  <div style="width:32px;height:32px"></div>
</div>
<div style="flex:1;overflow:hidden;padding:6px 14px 24px">
  <div style="display:flex;flex-wrap:wrap;justify-content:space-between">{cards}</div>
</div>"""


# ─────────────────────────────────────────────────────────────────────────────
# SCREEN 9 — Mini Player (home con mini player visible en contexto)
# ─────────────────────────────────────────────────────────────────────────────
def screen_mini_player(t):
    rows = ""
    for cov, title, artist in [
        (COV_A,"No One Noticed","The Marías"),
        (COV_A,"Sienna","The Marías"),
        (COV_B,"Heavy","The Marías"),
        (COV_A,"Lejos de Ti","The Marías"),
        (COV_C,"Nobody New","The Marías"),
        (COV_C,"Back To Me","The Marías"),
        (COV_E,"Cariño","The Marías"),
        (COV_F,"Scary Monsters","Skrillex"),
    ]:
        rows += f"""<div style="display:flex;align-items:center;padding:7px 14px 7px 12px;
  min-height:56px;border-bottom:1px solid {t['track_border']}">
  <img src="{cov}" style="width:42px;height:42px;border-radius:9px;object-fit:cover;
    flex-shrink:0;margin-right:11px">
  <div style="flex:1;min-width:0">
    <div style="font-size:14px;font-weight:700;color:{t['tp']};overflow:hidden;
      text-overflow:ellipsis;white-space:nowrap">{title}</div>
    <div style="font-size:11.5px;font-weight:500;color:{t['ts']};margin-top:2px">{artist}</div>
  </div>
  <ion-icon name="ellipsis-horizontal" style="font-size:17px;color:{t['tm']};flex-shrink:0"></ion-icon>
</div>"""

    return f"""{status_bar(t)}
{tab_carousel(t, "Tracks")}
<div style="flex:1;overflow:hidden;position:relative;padding-bottom:92px">
  <div style="padding:6px 12px 10px">{search_bar(t, "Buscar pista…")}</div>
  {rows}
</div>
{mini_player(t)}"""


# ─────────────────────────────────────────────────────────────────────────────
# SCREEN 10 — +Not Found
# ─────────────────────────────────────────────────────────────────────────────
def screen_not_found(t):
    return f"""{status_bar(t)}
<div style="flex:1;display:flex;flex-direction:column;align-items:center;
  justify-content:center;padding:28px">
  <ion-icon name="alert-circle-outline"
    style="font-size:64px;color:{t['tm']};margin-bottom:20px"></ion-icon>
  <div style="font-size:22px;font-weight:800;color:{t['tp']};
    margin-bottom:10px;text-align:center">Oops!</div>
  <div style="font-size:14px;font-weight:500;color:{t['ts']};
    text-align:center;margin-bottom:32px;line-height:22px">Esta pantalla no existe.</div>
  <div style="padding:13px 24px;border-radius:14px;background:{t['accent']}">
    <span style="font-size:14px;font-weight:700;color:#fff">Volver al inicio</span>
  </div>
</div>
{home_ind(t)}"""


# ─────────────────────────────────────────────────────────────────────────────
# SCREEN 11 — Detalle Álbum (overlay)
# ─────────────────────────────────────────────────────────────────────────────
def screen_album_detail(t):
    rows = ""
    for num, title, dur in [
        ("1","No One Noticed","3:56"),("2","Sienna","3:44"),
        ("3","Heavy","4:13"),("4","Lejos de Ti","2:59"),("5","Nobody New","3:35"),
    ]:
        rows += f"""<div style="display:flex;align-items:center;padding:9px 20px;
  border-bottom:1px solid {t['divider']}">
  <span style="font-size:11.5px;font-weight:600;color:{t['tm']};
    width:18px;flex-shrink:0;margin-right:10px">{num}</span>
  <img src="{COV_A}" style="width:38px;height:38px;border-radius:8px;object-fit:cover;
    flex-shrink:0;margin-right:10px">
  <div style="flex:1;min-width:0">
    <div style="font-size:13px;font-weight:700;color:{t['tp']};overflow:hidden;
      text-overflow:ellipsis;white-space:nowrap">{title}</div>
    <div style="font-size:10.5px;color:{t['ts']};margin-top:1px">The Marías</div>
  </div>
  <span style="font-size:10.5px;color:{t['tm']}">{dur}</span>
</div>"""

    return f"""{status_bar(t)}
<div style="flex:1;overflow:hidden;display:flex;flex-direction:column">
  <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px 8px">
    <div style="width:36px;height:36px;border-radius:18px;background:{t['icon_bg']};
      display:flex;align-items:center;justify-content:center">
      <ion-icon name="chevron-down-outline" style="font-size:18px;color:{t['ts']}"></ion-icon>
    </div>
    <span style="font-size:11px;font-weight:700;letter-spacing:1.1px;color:{t['tm']}">ÁLBUM</span>
    <div style="width:36px"></div>
  </div>
  <div style="display:flex;align-items:center;justify-content:center;padding:0 40px 12px">
    <div style="width:230px;height:230px;border-radius:22px;overflow:hidden;
      box-shadow:0 16px 48px rgba(0,0,0,0.26)">
      <img src="{COV_A}" style="width:100%;height:100%;object-fit:cover">
    </div>
  </div>
  <div style="padding:0 20px 10px">
    <div style="font-size:21px;font-weight:800;color:{t['tp']};
      letter-spacing:-0.5px;line-height:1.2;margin-bottom:3px">No One Noticed</div>
    <div style="font-size:14px;font-weight:600;color:{t['ts']};margin-bottom:9px">The Marías</div>
    <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:12px">
      <span style="font-size:9.5px;font-weight:700;color:{t['ts']};
        border:1px solid {t['border_bright']};border-radius:6px;padding:2px 7px">2021</span>
      <span style="font-size:9.5px;font-weight:700;color:{t['ts']};
        border:1px solid {t['border_bright']};border-radius:6px;padding:2px 7px">EP</span>
      <span style="font-size:9.5px;font-weight:700;color:{t['accent']};
        border:1px solid rgba(163,0,0,0.35);border-radius:6px;padding:2px 7px">FLAC</span>
      <span style="font-size:9.5px;font-weight:700;color:{t['accent']};
        border:1px solid rgba(163,0,0,0.35);border-radius:6px;padding:2px 7px">96 kHz</span>
    </div>
    <div style="display:flex;gap:10px;margin-bottom:8px">
      <div style="flex:1;height:42px;border-radius:13px;background:{t['accent']};
        display:flex;align-items:center;justify-content:center;gap:6px">
        <ion-icon name="play" style="font-size:14px;color:#fff"></ion-icon>
        <span style="font-size:13px;font-weight:700;color:#fff">Reproducir</span>
      </div>
      <div style="flex:1;height:42px;border-radius:13px;background:{t['icon_bg']};
        display:flex;align-items:center;justify-content:center;gap:6px">
        <ion-icon name="shuffle-outline" style="font-size:14px;color:{t['icon_color']}"></ion-icon>
        <span style="font-size:13px;font-weight:700;color:{t['tp']}">Mezclar</span>
      </div>
    </div>
    <div style="font-size:11.5px;color:{t['tm']};margin-bottom:6px">8 canciones · 31 min 21 s</div>
  </div>
  <div style="border-top:1px solid {t['divider']};flex:1;overflow:hidden">{rows}</div>
</div>"""


# ─────────────────────────────────────────────────────────────────────────────
# SCREEN 12 — Cola / Queue
# ─────────────────────────────────────────────────────────────────────────────
def screen_queue(t):
    queue_items = [
        (COV_A,"Sienna","The Marías","3:44"),
        (COV_B,"Heavy","The Marías","4:13"),
        (COV_A,"Lejos de Ti","The Marías","2:59"),
        (COV_C,"Nobody New","The Marías","3:35"),
        (COV_D,"No One Noticed (Ext.)","The Marías","4:44"),
        (COV_C,"Back To Me","The Marías","3:34"),
        (COV_E,"Cariño","The Marías","4:18"),
    ]
    queue_rows = ""
    for i, (cov, title, artist, dur) in enumerate(queue_items):
        last = i == len(queue_items) - 1
        border = "" if last else f"border-bottom:1px solid {t['track_border']};"
        queue_rows += f"""<div style="display:flex;align-items:center;padding:8px 20px;{border}">
  <span style="font-size:11px;font-weight:600;color:{t['tm']};
    width:20px;flex-shrink:0;margin-right:8px;text-align:center">{i+2}</span>
  <img src="{cov}" style="width:40px;height:40px;border-radius:9px;object-fit:cover;
    flex-shrink:0;margin-right:10px">
  <div style="flex:1;min-width:0">
    <div style="font-size:13.5px;font-weight:700;color:{t['tp']};overflow:hidden;
      text-overflow:ellipsis;white-space:nowrap">{title}</div>
    <div style="font-size:11px;color:{t['ts']};margin-top:2px">{artist}</div>
  </div>
  <span style="font-size:10.5px;color:{t['tm']};flex-shrink:0">{dur}</span>
</div>"""

    return f"""{status_bar(t)}
<div style="flex:1;overflow:hidden;display:flex;flex-direction:column">
  <div style="display:flex;align-items:center;justify-content:space-between;
    padding:14px 20px 10px;flex-shrink:0">
    <div style="width:36px;height:36px;border-radius:18px;background:{t['icon_bg']};
      display:flex;align-items:center;justify-content:center">
      <ion-icon name="chevron-down-outline" style="font-size:18px;color:{t['ts']}"></ion-icon>
    </div>
    <span style="font-size:11px;font-weight:700;letter-spacing:1.2px;color:{t['ts']}">COLA</span>
    <div style="width:36px"></div>
  </div>
  <div style="flex:1;overflow:hidden">
    <div style="padding:0 20px 8px">
      <div style="font-size:10px;font-weight:700;letter-spacing:1.2px;
        color:{t['accent']};margin-bottom:10px">REPRODUCIENDO AHORA</div>
      <div style="display:flex;align-items:center;padding:10px 12px;
        border-radius:14px;background:rgba(163,0,0,0.10);
        border:1px solid rgba(163,0,0,0.28);margin-bottom:8px">
        <img src="{COV_A}" style="width:46px;height:46px;border-radius:10px;
          object-fit:cover;flex-shrink:0;margin-right:12px">
        <div style="flex:1;min-width:0">
          <div style="font-size:14px;font-weight:800;color:{t['tp']};margin-bottom:2px;
            overflow:hidden;text-overflow:ellipsis;white-space:nowrap">No One Noticed</div>
          <div style="font-size:11.5px;font-weight:500;color:{t['ts']}">The Marías</div>
        </div>
        <ion-icon name="pulse-outline" style="font-size:18px;color:{t['accent']};flex-shrink:0"></ion-icon>
      </div>
    </div>
    <div style="height:1px;background:{t['divider']};margin:0 20px 10px"></div>
    <div style="padding:0 20px">
      <div style="font-size:10px;font-weight:700;letter-spacing:1.2px;
        color:{t['ts']};margin-bottom:8px">A CONTINUACIÓN</div>
      {queue_rows}
    </div>
  </div>
</div>
{home_ind(t)}"""


# ─────────────────────────────────────────────────────────────────────────────
# SCREEN 13 — Letras / Lyrics
# ─────────────────────────────────────────────────────────────────────────────
def screen_lyrics(t):
    lines = [
        ("I know you've been here before", False),
        ("The lights go dim",              False),
        ("And you walk through the door",  False),
        ("No one noticed",                 True),
        ("Not a single soul",              False),
        ("Baby, tell me",                  False),
        ("Why you're standing alone",      False),
        ("I know your face",               False),
        ("But I don't know your name",     False),
        ("And if I said it wrong",         False),
    ]
    lyric_rows = ""
    for text, active in lines:
        if active:
            lyric_rows += f"""<div style="display:flex;align-items:center;padding:7px 0;margin-bottom:3px">
  <div style="font-size:18px;font-weight:800;color:{t['tp']};
    letter-spacing:-0.2px;line-height:1.4;flex:1">{text}</div>
  <div style="width:6px;height:6px;border-radius:3px;background:{t['accent']};
    margin-left:8px;flex-shrink:0"></div>
</div>"""
        else:
            lyric_rows += f"""<div style="padding:5px 0;margin-bottom:2px">
  <div style="font-size:14.5px;font-weight:500;color:{t['ts']};
    line-height:1.4;opacity:0.72">{text}</div>
</div>"""

    return f"""{status_bar(t)}
<div style="flex:1;overflow:hidden;display:flex;flex-direction:column">
  <div style="display:flex;align-items:center;justify-content:space-between;
    padding:14px 20px 10px;flex-shrink:0">
    <div style="width:36px;height:36px;border-radius:18px;background:{t['icon_bg']};
      display:flex;align-items:center;justify-content:center">
      <ion-icon name="chevron-down-outline" style="font-size:18px;color:{t['ts']}"></ion-icon>
    </div>
    <span style="font-size:11px;font-weight:700;letter-spacing:1.2px;color:{t['ts']}">LETRAS</span>
    <div style="width:36px"></div>
  </div>
  <div style="padding:0 20px 10px;border-bottom:1px solid {t['divider']};flex-shrink:0">
    <div style="font-size:16px;font-weight:800;color:{t['tp']};margin-bottom:2px">No One Noticed</div>
    <div style="font-size:13.5px;font-weight:500;color:{t['ts']}">The Marías</div>
  </div>
  <div style="flex:1;overflow:hidden;padding:14px 20px 0">{lyric_rows}</div>
  <div style="padding:12px 20px;text-align:center">
    <div style="font-size:13.5px;font-weight:700;color:{t['tp']};margin-bottom:2px">No One Noticed</div>
    <div style="font-size:11.5px;color:{t['tm']}">The Marías · Submarine</div>
  </div>
</div>
{home_ind(t)}"""


# ─────────────────────────────────────────────────────────────────────────────
# SCREEN 14 — Opciones Player (bottom sheet)
# ─────────────────────────────────────────────────────────────────────────────
def screen_player_options(t):
    items = [
        ("add-circle-outline",         "Añadir a playlist",  ""),
        ("time-outline",               "Sleep timer",        "Sin temporizador"),
        ("moon-outline",               "Modo sueño",         "Desactivado"),
        ("information-circle-outline", "Info del archivo",   "FLAC · 24-bit · 48 kHz"),
    ]
    rows = ""
    for i, (ico, label, sub) in enumerate(items):
        last = i == len(items) - 1
        border = "" if last else f"border-bottom:1px solid {t['divider']};"
        sub_h = f'<div style="font-size:10.5px;color:{t["tm"]};margin-top:2px">{sub}</div>' if sub else ""
        rows += f"""<div style="display:flex;align-items:center;padding:10px 0;{border}gap:13px">
  {icon_sq(t, ico, 19)}
  <div style="flex:1">
    <div style="font-size:14.5px;font-weight:600;color:{t['tp']}">{label}</div>
    {sub_h}
  </div>
  <ion-icon name="chevron-forward-outline" style="font-size:15px;color:{t['tm']}"></ion-icon>
</div>"""

    return f"""<div style="flex:1;display:flex;flex-direction:column;justify-content:flex-end;
  position:relative">
  <div style="position:absolute;inset:0;background:rgba(0,0,0,0.38)"></div>
  <div style="position:relative;background:{t['sheet_bg']};border-radius:28px 28px 0 0;
    padding:0 20px 40px;z-index:2">
    <div style="width:40px;height:5px;border-radius:3px;background:{t['border_bright']};
      margin:12px auto 14px"></div>
    <div style="margin-bottom:10px">
      <div style="font-size:15.5px;font-weight:800;color:{t['tp']};margin-bottom:2px">No One Noticed</div>
      <div style="font-size:12.5px;font-weight:500;color:{t['ts']}">The Marías · Submarine</div>
    </div>
    <div style="height:1px;background:{t['divider']};margin-bottom:4px"></div>
    {rows}
    <div style="margin-top:14px;border-radius:16px;background:{t['icon_bg']};
      padding:15px;text-align:center">
      <span style="font-size:14.5px;font-weight:600;color:{t['tp']}">Cancelar</span>
    </div>
  </div>
</div>"""


# ─────────────────────────────────────────────────────────────────────────────
# SCREEN 15 — Menú Track (bottom sheet)
# ─────────────────────────────────────────────────────────────────────────────
def screen_track_menu(t):
    items = [
        ("heart-outline",          "Me gusta",           False),
        ("list-outline",           "Añadir a cola",      False),
        ("musical-notes-outline",  "Ir al álbum",        False),
        ("person-outline",         "Ver artista",        False),
        ("trash-outline",          "Eliminar de lista",  True),
    ]
    rows = ""
    for i, (ico, label, danger) in enumerate(items):
        last = i == len(items) - 1
        border = "" if last else f"border-bottom:1px solid {t['divider']};"
        color = "#A30000" if danger else t["tp"]
        rows += f"""<div style="display:flex;align-items:center;padding:10px 0;{border}gap:13px">
  {icon_sq(t, ico, 19, danger=danger)}
  <span style="flex:1;font-size:14.5px;font-weight:600;color:{color}">{label}</span>
  <ion-icon name="chevron-forward-outline" style="font-size:15px;color:{t['tm']}"></ion-icon>
</div>"""

    return f"""<div style="flex:1;display:flex;flex-direction:column;justify-content:flex-end;
  position:relative">
  <div style="position:absolute;inset:0;background:rgba(0,0,0,0.38)"></div>
  <div style="position:relative;background:{t['sheet_bg']};border-radius:28px 28px 0 0;
    padding:0 20px 40px;z-index:2">
    <div style="width:40px;height:5px;border-radius:3px;background:{t['border_bright']};
      margin:12px auto 14px"></div>
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
      <img src="{COV_A}" style="width:46px;height:46px;border-radius:10px;
        object-fit:cover;flex-shrink:0;border:1px solid {t['border']}">
      <div>
        <div style="font-size:15.5px;font-weight:800;color:{t['tp']};margin-bottom:2px">No One Noticed</div>
        <div style="font-size:12.5px;font-weight:500;color:{t['ts']}">The Marías · 3:56</div>
      </div>
    </div>
    <div style="height:1px;background:{t['divider']};margin-bottom:4px"></div>
    {rows}
    <div style="margin-top:14px;border-radius:16px;background:{t['icon_bg']};
      padding:15px;text-align:center">
      <span style="font-size:14.5px;font-weight:600;color:{t['tp']}">Cancelar</span>
    </div>
  </div>
</div>"""


# ─────────────────────────────────────────────────────────────────────────────
# Composition
# ─────────────────────────────────────────────────────────────────────────────
SCREENS = [
    ("Library",         screen_library),
    ("Álbum",           screen_album),
    ("Tracks",          screen_tracks),
    ("Artista",         screen_artista),
    ("Playlist",        screen_playlist),
    ("Ajustes",         screen_settings),
    ("Player",          screen_player),
    ("All Albums",      screen_all_albums),
    ("Mini Player",     screen_mini_player),
    ("+Not Found",      screen_not_found),
    ("Detalle Álbum",   screen_album_detail),
    ("Cola (Queue)",    screen_queue),
    ("Letras",          screen_lyrics),
    ("Opciones Player", screen_player_options),
    ("Menú Track",      screen_track_menu),
]


def render_row(t: dict) -> str:
    border_c = "rgba(0,0,0,0.13)" if t["mode"] == "light" else "rgba(255,255,255,0.11)"
    phones = ""
    for label, builder in SCREENS:
        content = builder(t)
        phones += f"""<div style="display:flex;flex-direction:column;align-items:center;gap:12px;flex-shrink:0">
  <span style="font-size:11px;font-weight:600;color:#555;
    letter-spacing:0.5px;font-family:monospace">{label}</span>
  <div style="width:390px;height:844px;border-radius:44px;overflow:hidden;
      position:relative;display:flex;flex-direction:column;
      background:{t['bg']};border:1px solid {border_c};
      box-shadow:0 32px 80px rgba(0,0,0,0.52),inset 0 0 0 1px rgba(255,255,255,0.04)">
    {content}
  </div>
</div>"""
    return f'<div style="display:flex;flex-direction:row;gap:40px;align-items:flex-start">{phones}</div>'


def section_header(title, subtitle, margin_top=0):
    return f"""<div style="margin-top:{margin_top}px;margin-bottom:24px">
  <div style="font-size:11px;font-weight:700;letter-spacing:3px;
    color:#3a3a3a;text-transform:uppercase">{title}</div>
  <div style="font-size:13px;color:#3a3a3a;font-weight:500;
    margin-top:4px;letter-spacing:0.5px">{subtitle}</div>
</div>"""


def build():
    tl = mk_theme("light")
    td = mk_theme("dark")

    return f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Figma Preview — Music Player · 30 Artboards</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
<script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
<style>
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  body {{
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    background: #0C0C0E;
    overflow-x: auto;
    overflow-y: auto;
  }}
</style>
</head>
<body>
<div style="padding:64px;min-width:max-content">

  <div style="margin-bottom:64px">
    <h1 style="font-size:38px;font-weight:900;color:#fff;
      letter-spacing:-1.5px;margin-bottom:6px">Figma Preview</h1>
    <p style="font-size:13px;color:#444;font-weight:500;letter-spacing:2px">
      30 ARTBOARDS &nbsp;·&nbsp; 2 TEMAS &nbsp;·&nbsp; 15 PANTALLAS CADA UNO
    </p>
  </div>

  {section_header("MODO CLARO — 15 PANTALLAS", "Tema light · fondo #F8F7F4", margin_top=0)}
  {render_row(tl)}

  {section_header("MODO OSCURO — 15 PANTALLAS", "Tema dark · fondo #121212", margin_top=96)}
  {render_row(td)}

  <div style="height:96px"></div>
</div>
</body>
</html>"""


if __name__ == "__main__":
    html = build()
    with open("screens-preview.html", "w", encoding="utf-8") as f:
        f.write(html)
    print(f"✅  screens-preview.html generado — {len(SCREENS)*2} artboards · {len(html):,} chars")
