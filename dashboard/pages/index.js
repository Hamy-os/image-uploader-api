import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faSearch,
} from "@fortawesome/free-solid-svg-icons";


export default function Home() {
  return (
    <div>
          <h1 className="text-3xl font-bold underline">
      Hello world!
    </h1>
       <FontAwesomeIcon
        icon={faSearch}
        style={{ fontSize: 100, color: "blue" }}
      />
    </div>

  )
}
