<!-- ═══════════════════════════════════════════════════════════════════════ -->

<div align="center">

# <img src="ref/mode-run.webp"> dsh-ohjingjing-team <img src="ref/mode-eat.webp">

### Replacing the status icons in the DSH Agent Team panel's member rows with "ohjingjing"

**A pure CSS skin**: registers no slots, reads no remote data, modifies no official component

[![DSH](https://img.shields.io/badge/DSH-0.2.0--rc.2%20--%200.2.1--alpha.2-blue)](https://github.com/deepseek-ai/deepseek-harness)
![Node](https://img.shields.io/badge/Node-22%2B-339933?logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)
![Zero JS](https://img.shields.io/badge/runtime-zero%20JS-8a5cf6)

[**中文**](README.md) &nbsp;·&nbsp; **English**

</div>

---

## 🐳 What is this

~~A team of ohjingjing~~ — replacing the status icons on the left of each member row in the DSH Agent Team panel with "ohjingjing".

<p align="center">
  <img src="ref/panel-live.webp" width="569"><br>
  <sub>An ohjingjing team</sub>
</p>

## 🎬 Running

A running ohjingjing has 4 animations:
<p align="center">
 <img src="ref/mode-run.webp">  <img src="ref/mode-back.webp">  <img src="ref/mode-eat.webp">  <img src="ref/mode-back-eat.webp"> <br>
 <sub>Previews of the four running modes</sub>
</p>

## 🎯 Standing still

The icon slot on the left of each member row in the Team panel (the "Agent Team" popover in the session header):


<p align="center">
  <img src="ref/state-sprites.png"><br>
  <sub>Previews of the four non-running states: idle / handstand / warning / done — the last two are task-dot art and do not apply to member rows in this version</sub>
</p>

## 📦 Install
### CLI
```sh
dsh plugin --profile web add dsh-ohjingjing-team          
```
### Web / desktop plugin manager
On the plugin manager page, click "Add plugin" in the top right → enter the plugin name `dsh-ohjingjing-team` or the repository name
```sh
https://github.com/SpookyWaste/dsh-ohjingjing-team
```
Refresh the Web GUI and open the Team panel once.

| Item | Value |
|---|---|
| Official Agent Team component<sub>@deepseek-ai/dsh-experimental-agent-team-profile</sub> | keep it enabled |
| DSH | `≥0.2.0-rc.2` |

## 🎛 Tunables

Appearance lives in custom properties on `:root`; overriding them needs no rebuild (user styles or browser overrides work):

| Variable | Default | Meaning |
|---|---|---|
| `--oj-max-size` | `40px` | Upper bound so the icon cannot run away at extreme font sizes. |
| `--oj-duration` | `0.7s` | **One cycle**. Modes with more steps scale up automatically. |

## 📜 Versions

<details>
<summary>Version history (click to expand)</summary>

- **0.3.0** — the running state goes from "one seven-frame loop" to **four** animations.
- **0.2.2** — fixes **bleed from the neighbouring frame** at frame edges.
- **0.2.1** — fixes the running animation **skipping one frame**: the keyframe time scale and position scale had been written as the same scale, so the last frame's interval had zero length.
- **0.2.0** — the failed state switches to a **handstand** pose; the running state goes from a two-frame round trip to a **seven-frame loop**.
- **0.1.2** — fixes clipped artwork in the failed state.
- **0.1.1** — fixes blurred icons on high-DPI screens and the `error` state falling back to `idle`; the default icon edge length goes 28px → 31px (using up the two text lines' height, with the member card still 51px).
- **0.1.0** — first release.

</details>

## 🙏 Artwork credit and license

"Ohjingjing" is the name the community uses; the character's real name is "Shenshen", and the design is licensed CC BY-NC-SA.
- Original whale-girl character design by [ZipZipPipe](https://space.bilibili.com/4168597).
- The "ohjingjing" (Shenshen) design by [这个刀子真甜](https://space.bilibili.com/23315338).
- This repository's code is MIT (see [LICENSE](LICENSE)).

<!-- ═══════════════════════════════════════════════════════════════════════ -->
