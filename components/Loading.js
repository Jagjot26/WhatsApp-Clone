import { ThreeBounce } from "better-react-spinkit";

function Loading() {
  return (
    <center
      style={{
        display: "grid",
        height: "100vh",
        placeItems: "center",
      }}
    >
      <div>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp logo"
          styles={{
            marginBottom: 40,
          }}
          height={200}
        ></img>

        <div>
          <ThreeBounce color="#3cbc28" size={12} />
        </div>
      </div>
    </center>
  );
}

export default Loading;
