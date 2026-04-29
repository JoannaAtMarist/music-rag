# 🎵 music-rag

A local, end-to-end RAG (Retrieval-Augmented Generation) learning project that turns your personal music library into a semantic search engine and visual embedding explorer.

---

## What this project does

Music files  
→ metadata scan  
→ text chunks  
→ embeddings  
→ semantic search  
→ visualization (2D embedding map)  

You can search your music by meaning instead of exact keywords and see how songs cluster together visually.

---

## Key Concepts

- Metadata extraction
- Chunking
- Embeddings
- Vector similarity search
- RAG pipeline basics
- Dimensionality reduction (PCA)

---

## Visualization Feature

This project includes a 2D embedding visualization:  

- Each dot = one song
- Closer dots = more similar songs
- Hover to see title, artist, album

This helps make embeddings intuitive and visible.

---

## Project Structure
```
music-rag/
  data/
    library.json
    chunks.json
    embeddings.json 
    visualization.json
    artwork/

  src/
    scanner/             # Phase 1: scan music files
    core/                # chunking, embeddings, search, visualization
    types/
    utilities/

  public/
    visualization.html   # interactive scatterplot
```
---

## Setup

Install dependencies:
```
npm install
```
Create .env:
```
OPENAI_API_KEY=your_api_key_here
EMBEDDING_MODEL=text-embedding-3-small
```
---

## Usage

1. Scan music:
```
npm run scan -- "PATH_TO_YOUR_MUSIC"
```
2. Chunk data:
```
npm run chunk
```
3. Generate embeddings:
```
npm run embed
```
4. Search:
```
npm run search -- "mellow 70s rock"
```
5. Generate visualization data:
```
npm run visualize:data
```
6. View visualization:
```
npm run visualize
```
Then open:
```
/public/visualization.html
```
---

## Tech Stack

- Node.js
- TypeScript
- OpenAI API
- music-metadata
- PCA (via ml-pca)
- HTML Canvas (for visualization)

---

## Notes

- embeddings.json is large and should not be committed
- file paths reflect the scan machine

---

## Purpose

This project is designed to learn and demonstrate RAG systems using real personal data, with an emphasis on understanding:

- how embeddings work
- how semantic search differs from keyword search
- how vector spaces can be visualized

---

## Status

- Scanning complete
- Chunking complete
- Embeddings complete (resumable)
- Semantic search working
- Visualization working

---

## Future Improvements

- Album artwork display in visualization
- Web UI for search
- Playlist generation
- LLM-generated responses (full RAG)
- Local embedding models (offline mode)