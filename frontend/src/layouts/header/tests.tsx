import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import Header from "./header";
import userEvent from "@testing-library/user-event";
import { mockUser } from "@/testing/mocks/mocks";

describe("Header", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Header user={mockUser} />
      </MemoryRouter>,
    );
  });
  describe("Notifications window", () => {
    it("clicking on notification button open notification window", async () => {
      const button = screen.getByLabelText("Notifications");

      await user.click(button);
      const notificationsWindow = screen.getByRole("dialog");

      expect(
        within(notificationsWindow).getByRole("heading", {
          name: /notifications/,
        }),
      ).toBeInTheDocument();
    });

    it("clicking outside closes notification window", async () => {
      const button = screen.getByLabelText("Notifications");

      await user.click(button);
      const notificationsWindow = screen.getByRole("dialog");
      await user.click(document.body);

      expect(notificationsWindow).not.toBeInTheDocument();
    });
  });

  describe("profile window", () => {
    it("clicking on profile picture opens profile window", async () => {
      const button = screen.getByLabelText("Profile");

      await user.click(button);
      const profileWindow = screen.getByRole("dialog");

      expect(
        within(profileWindow).getByRole("button", {
          name: /Profile/,
        }),
      ).toBeInTheDocument();
    });

    it("clicking outside closes profile window", async () => {
      const button = screen.getByLabelText("Profile");

      await user.click(button);
      const profileWindow = screen.getByRole("dialog");
      await user.click(document.body);

      expect(profileWindow).not.toBeInTheDocument();
    });
  });
});
