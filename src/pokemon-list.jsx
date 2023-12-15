// You can retrieve the pokemons by calling the following API
// Make sure to replace limit and offset with the appropriate values
// https://pokeapi.co/api/v2/pokemon?limit=5&offset=0

import { useState, useEffect } from "react";

const PokemonList = () => {
  // Daftar pokemon (sudah bentuk element)
  const [pokemonList, setPokemonList] = useState([]);

  // Total pokemon
  const [total, setTotal] = useState(0);

  // API (url) untuk tarik daftar pokemon
  const [url, setUrl] = useState(
    "https://pokeapi.co/api/v2/pokemon?limit=5&offset=0"
  );

  // Status apakah daftar sedang diproses
  const [loading, setLoading] = useState(false);

  // GET daftar pokemon dari API (url)
  const fetchInfo = async () => {
    if (loading) return; // Cegah request baru apabila masih memproses data
    setLoading(true);

    try {
      const res = await fetch(url);
      const data = await res.json();

      //  Gabungkan daftar lama dengan daftar yang baru ditarik
      //  Daftar baru langsung dimap jadi element, biar nantinya gak perlu map ulang seluruh daftar (intinya biar proses cepat)
      setPokemonList((prevList) => [
        ...prevList,
        ...data.results.map((dataObj, index) => {
          const currentIndex = prevList.length + index;
          return (
            <div key={currentIndex} {...card}>
              <img
                // Indeks link sprite sama dengan indeks pokemon, kecuali mulai 1018 lompat ke indeks 10001
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                  currentIndex + 1 < 1018
                    ? currentIndex + 1
                    : currentIndex + 8984
                }.png`}
                {...sprite}
              />
              <div {...itemInfo}>
                <p style={{ margin: "0" }}>No. {currentIndex + 1}</p>
                <p style={{ margin: "0" }} role="listitem">
                  {dataObj.name}
                </p>
              </div>
            </div>
          );
        }),
      ]);

      //  Set total pokemon yang tersedia di sumber API
      setTotal(data.count);

      // Set API (url) baru untuk tarik daftar selanjutnya [kebetulan sudah disediakan dari API-nya]
      setUrl(data.next);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Ambil daftar pertama dari API (url) [hanya berjalan sekali]
  useEffect(() => {
    fetchInfo();
  }, []);

  // Objek element beserta styles (terpaksa begini karena kalo tambah css 'npm run test' bakal error)
  const container = {
    style: {
      display: "flex",
      flexDirection: "column",
      flexWrap: "nowrap",
      alignItems: "center",
      fontFamily: "Helvetica",
    },
  };

  const header = {
    style: { display: "flex", alignItems: "center", gap: "1rem" },
  };

  const logo = {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/512px-Pok%C3%A9_Ball_icon.svg.png",
    alt: "logo",
    style: {
      width: "4vmax",
      height: "4vmax",
    },
  };

  const title = {
    children: "POKEMON LIST",
    style: {
      textAlign: "center",
      fontSize: "calc(0.5rem + 1.5vmax)",
      fontWeight: "bold",
      color: "#F9F7F7",
      letterSpacing: "5px",
    },
  };

  const list = {
    children: pokemonList,
    role: "list",
    style: {
      width: "80%",
      height: "70vh",
      display: "flex",
      flexWrap: "wrap",
      alignContent: "flex-start",
      gap: "20px",
      padding: "20px",
      overflowY: "auto",
      border: "10px solid #3F72AF",
      borderRadius: "10px",
      boxSizing: "border-box",
      background: "#DBE2EF",
    },
  };

  const card = {
    style: {
      // Fluid layout
      flex: "1 0 13rem",
      textTransform: "capitalize",
      background: "#F9F7F7",
      display: "flex",
      alignItems: "center",
      gap: "20px",
      padding: "10px",
      borderRadius: "10px",
      fontWeight: "bold",
    },
  };

  const itemInfo = {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
  };

  const sprite = {
    alt: "sprite",
    style: {
      width: "100px",
      height: "100px",
    },
    loading: "lazy", // entah apa ini
    onError: (e) => {
      // Set gambar default apabila error
      e.target.src =
        "https://styles.redditmedia.com/t5_2t5aw/styles/communityIcon_gjw0pkz01bm61.jpg?format=pjpg&s=7fb1b800d7f877d0c0b9ad274e9a6b19964baef8";
    },
  };

  const displayStatus = {
    children: `Displaying ${pokemonList.length} of ${total} results`,
    style: { paddingTop: "20px", fontWeight: "bold", color: "#F9F7F7" },
  };

  const loadBtn = {
    children: "Load more",
    role: "button",
    style: {
      padding: "15px 30px",
      borderRadius: "25px",
      border: "none",
      fontWeight: "bold",
      cursor: "pointer",
      color: "#F9F7F7",
      background: "#3F72AF",
    },
    onClick: () => fetchInfo(),
  };

  return (
    <div {...container}>
      <div {...header}>
        <img {...logo} />
        <p {...title} />
        <img {...logo} />
      </div>

      {/* Daftar pokemon */}
      <div {...list} />

      {/* Jumlah pokemon yang ditampilkan saat ini */}
      <p {...displayStatus} />

      {/* Perlihatkan tombol tambah pokemon apabila belum semua pokemon ditampilkan */}
      {pokemonList.length != total && <button {...loadBtn} />}
    </div>
  );
};

export default PokemonList;
