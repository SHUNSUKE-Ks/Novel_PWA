# コレクション（図鑑）データ定義書

キャラクター図鑑およびサウンドプレイヤーで使用するJSONデータのフォーマットと、現在のアセットに基づいたパスの提案です。

## 1. キャラクター図鑑 (`characters.json`)

Notionのデータベースのように、属性（タグ）や詳細プロパティを持たせる構成です。

### JSONフォーマット
```json
{
  "characters": [
    {
      "id": "curea",
      "name": "クレア",
      "reading": "これあ",
      "title": "見習い騎士",
      "description": "騎士団に所属する見習い少女。正義感が強い。",
      "details": {
        "status": "味方",
        "gender": "女性",
        "hobbies": "剣稽古"
      },
      "assets": {
        "icon": "src/assets/chara/Curea.png",
        "full": "src/assets/chara/Curea.png"
      },
      "tags": ["ALLY", "KNIGHT"]
    }
  ]
}
```

### アセットパスの提案
| キャラクター名 | パス (src/assets/chara/) |
| :--- | :--- |
| クレア | `Curea.png` |
| 案内少女 | `案内少女-removebg-preview.png` |
| 白髪の少年 | `hakuhatu.png` |
| 謎の人物 | `IMG_0038-removebg-preview.png` |

---

## 2. サウンド図鑑 (`sounds.json`)

BGMプレイヤーやSEリストで使用する構成です。

### JSONフォーマット
```json
{
  "tracks": [
    {
      "id": "bgm_op",
      "title": "メインテーマ",
      "category": "BGM",
      "path": "src/assets/sound/bgm/Game_Op.mp3",
      "description": "物語の幕開けを飾る曲。"
    }
  ]
}
```

### アセットパスの提案 (BGM)
| 曲名 | パス (src/assets/sound/bgm/) |
| :--- | :--- |
| オープニング | `Game_Op.mp3` |
| ジングル | `jingle_06.mp3` |
| 森のささやき | `mori01.m4a` |
| 戦いの鼓動 | `戦いの鼓動.mp3` |

### アセットパスの提案 (SE)
| 効果音名 | パス (src/assets/sound/se/) |
| :--- | :--- |
| ノック | `ドアノック1.mp3` |
| ページめくり | `ページをめくる1.mp3` |
| 抜刀 | `刀を構える.mp3` |
| 納刀 | `刀を鞘にしまう1.mp3` |
| 扉開放 | `扉が開く1.mp3` |

## 3. 実装の進め方（提案）
1. `src/assets/data/characters.json` および `sounds.json` を作成する。
2. `CollectionScreen.jsx` を更新し、まずはNotion風のリスト形式でこれらのデータを表示する。
3. フィルタリング機能（タグによる絞り込み）を実装し、整理された図鑑として機能させる。
