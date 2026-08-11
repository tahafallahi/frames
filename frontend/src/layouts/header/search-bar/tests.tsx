import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import SearchBar from "./search-bar";
import userEvent from "@testing-library/user-event";

describe("SearchBar", () => {
  beforeEach(() => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <SearchBar />
      </MemoryRouter>,
    );
  });

  it("focsing on search bar opens search window", async () => {
    const user = userEvent.setup();
    const searchBar = screen.getByRole("textbox");

    await user.click(searchBar);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("tab closes search window", async () => {
    const user = userEvent.setup();
    const searchBar = screen.getByRole("textbox");

    await user.click(searchBar);
    await user.tab();

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
