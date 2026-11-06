# ★~｡.:*･ﾟ Y2K 平成レトロ ポートフォリオ ﾟ･*:.｡~★

2000年代初頭のインターネットカルチャー、サイバーY2K、平成ガラケー（i-mode）、そして平成を代表する名作カルチャー（**ケロロ軍曹・ファイナルファンタジー・らき☆すた**）へのリスペクトを詰め込んだ、遊び心満載のポートフォリオサイトです。

完全CDN構成＆静的ファイル（HTML / CSS / JavaScript）のみで構築されているため、ビルド不要で **GitHub Pages** や **Vercel** 等にアップロードするだけで即座にWeb公開できます。

---

## 🌟 主な特徴 & ギミック

1. **Y2K / 平成レトロデザイン**
   - 3Dサイバーワイヤーフレームグリッド & 星空アニメーション
   - Windows 2000 / XP スタイルのウィンドウUI
   - ブラウン管（CRT）走査線 & RGBシフト切替トグル
   - マウス＆タッチ追従のキラキラスパークルエフェクト
   - 平成ガラケー（バリ3アンテナ・バッテリー・i-mode接続）ステータスバー＆モバイル用ボトムナビ
   - 88x31 レトロ同盟バナー & 7セグメント風アクセスカウンター

2. **著作権クリーンなオマージュ & プレイルーム**
   - **ファイナルファンタジー風コマンドバトル**:
     - 伝統のブルーグラデーションウィンドウ、「たたかう」「まほう」「アイテム」「にげる」のインタラクティブコマンド
     - Web Audio APIによる勝利ファンファーレ演奏
   - **ケロロ軍曹風 地球（ポコペン）侵略電脳本部**:
     - 侵略進行度・ガンプラ制作スケジュール・隊員オマージュバッジ
   - **らき☆すた風 チョココロネ論争ウィジェット**:
     - 「頭から食べる派」vs「お尻から食べる派」のリアルタイム投票（LocalStorage連動）
   - **隠しコマンド（コナミコマンド）**:
     - PCキーボードで `↑` `↑` `↓` `↓` `←` `→` `←` `→` `B` `A` を入力するとスペシャルファンファーレ＆花吹雪！
   - ※ 公式画像や商標音源は一切使用せず、CSS/SVG/Web標準絵文字/Web Audio自作シンセで構成されているため、著作権侵害の心配なく安心してWeb公開・就活等に利用できます。

3. **完全CDN & スタンドアロン動作**
   - Tailwind CSS (CDN)
   - Lucide Icons (CDN)
   - Canvas-Confetti (CDN)
   - Google Fonts (DotGothic16, Orbitron, VT323, Silkscreen)
   - 外部音声ファイル不要の自前Web Audio APIシンセサイザー（Winamp風8bit Chiptune BGMループ、クリック音、スクラッチ音）

4. **スマートフォン完全対応（レスポンシブ）**
   - スマホ画面下部にガラケー風ソフトキー（親指操作ナビゲーション）を常駐
   - タップターゲットやフォントサイズをモバイル向けに最適化

---

## 🚀 GitHub Pages への公開手順（3分で完了！）

### 方法 1: Gitコマンドで公開する（推奨）

1. **GitHubで新規リポジトリを作成**
   - GitHubにログインし、[New repository](https://github.com/new) を開きます。
   - リポジトリ名を入力（例: `portfolio` や `y2k-portfolio`）。
   - **Public** を選択して「Create repository」をクリック。

2. **ローカルからPushする**
   PowerShellまたはターミナルで本フォルダを開き、以下のコマンドを実行します：

   ```powershell
   # 1. Gitの初期化 (まだ実行していない場合)
   git init
   git add .
   git commit -m "Initial commit: Y2K Heisei Portfolio"

   # 2. mainブランチに変更
   git branch -M main

   # 3. リモートリポジトリを追加 (YOUR_USERNAME と REPO_NAME を書き換えてください)
   git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

   # 4. GitHubにプッシュ
   git push -u origin main
   ```

3. **GitHub Pagesの設定をONにする**
   - GitHubのリポジトリページで **Settings**（設定）タブを開きます。
   - 左側メニューの **Pages** をクリックします。
   - **Build and deployment** の **Source** で：
     - **「GitHub Actions」** を選択（自動デプロイワークフロー `.github/workflows/deploy.yml` が自動実行されます）
     - または **「Deploy from a branch」** を選び、Branchを `main` / `/(root)` に設定して「Save」をクリック。
   - 1〜2分後、上部に公開URL（例: `https://YOUR_USERNAME.github.io/REPO_NAME/`）が表示され、世界中に公開されます！

---

## 🛠️ カスタマイズ方法（ご自身の情報に変更する）

### 1. お名前や肩書の変更 (`index.html`)
- `AIKON / CREATOR` → あなたのお名前
- `<title>` タグの変更
- プロフィール文・自己PR文言の書き換え

### 2. 前略プロフィールのQ&A変更 (`index.html`)
- `<div class="zenryaku-card">` 内の質問と回答をご自身の好みに変更できます。

### 3. 作品リストの追加・編集 (`index.html` & `script.js`)
- `index.html` の `#worksGrid` 内のカードを編集・追加できます。
- モーダルの詳細文は `script.js` 内の `worksData` オブジェクトで管理されています。

### 4. BBSの初期メッセージ (`script.js`)
- `script.js` 内の `defaultBbsPosts` 配列でお好きな初期カキコを設定できます。

---

## 📂 ファイル構成

```
portfolio/
├── index.html                  # メインHTML（レスポンシブ・CDN読み込み）
├── style.css                   # Y2K/平成/Windowsスタイル定義
├── script.js                   # Web Audioシンセ、BBS、ギミック、イースターエッグ
├── .nojekyll                   # GitHub PagesでJekyllを無効化する設定ファイル
├── .gitignore                  # Git除外設定
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages自動デプロイ用Actionsワークフロー
└── README.md                   # 本ドキュメント
```

---

## 📜 ライセンス / 免責事項
- 当リポジトリ内のコードはMITライセンスまたは個人ポートフォリオ用途として自由にご活用いただけます。
- 作中のオマージュ表現は各作品への敬意とファンアート精神によるパロディ演出です。公式のアセットは使用していません。
