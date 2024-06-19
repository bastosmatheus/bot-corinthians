import chalk from "chalk";
import readlineSync from "readline-sync";
import puppeteer, { Browser, Page } from "puppeteer";

type Positions = {
  [key: string]: string;
};

class Bot {
  private constructor(private browser: Browser, private page: Page) {}

  static async create() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    console.log(chalk.black.bgWhite("INICIANDO BOTRINTHIANS..."));
    await page.goto("https://www.corinthians.com.br/");

    return new Bot(browser, page);
  }

  public async execute() {
    const option = await this.menu();
    await this.options(parseInt(option));
  }

  private async menu() {
    console.clear();
    console.log(`BOTRINTHIANS\nEscolha uma opção: \n`);

    console.log(
      chalk.white.bold(
        `[1] Noticias\n[2] Elenco feminino\n[3] Elenco masculino\n[4] Proxs. partidas (feminino)\n[5] Proxs. partidas (masculino)\n[0] SAIR\n`
      )
    );

    const optionSelected = readlineSync.keyIn("Digite uma opcao (0 a 5): ", {
      limit: "$<0-5>",
      encoding: "utf-8",
    });

    return optionSelected;
  }

  private async options(option: number) {
    const buttonExists = await this.page.evaluate(async () => {
      const button = document.querySelector("#btn-cookie-notice-close");

      if (button) {
        return {
          button,
        };
      }
    });

    if (buttonExists) await this.page.click("#btn-cookie-notice-close");

    switch (option) {
      case 1:
        await this.news();
        break;
      case 2:
        await this.womensCast();
        break;
      case 3:
        await this.mensCast();
        break;
      case 4:
        await this.womensMatches();
        break;
      case 5:
        await this.mensMatches();
        break;
      default:
        await this.browser.close();
        return;
    }

    await this.page.goto("https://www.corinthians.com.br/");
    await this.execute();
  }

  private async mensCast() {
    await this.casts(".mb-3", {
      goleiros: "Goleiro",
      zagueiros: "Zagueiro",
      laterais: "Lateral",
      meias: "Meia",
      atacantes: "Atacante",
    });
  }

  private async womensCast() {
    await this.casts(".mt-3", {
      goleiras: "Goleira",
      zagueiras: "Zagueira",
      laterais: "Lateral",
      meias: "Meia",
      atacantes: "Atacante",
    });
  }

  private async casts(selector: string, positions: Positions) {
    await this.page.click(".ct-hamburguer .hamburguer-icon");

    await this.page.click(".ct-flex-align-center.menu-left ::-p-text(Futebol)");

    await this.page.click(
      `.ct-submenu.ct-submenu-image ${selector} ::-p-text(Elenco)`
    );

    await this.page.waitForSelector(".container");

    const players = await this.page.evaluate((positions) => {
      const playersList = document.querySelectorAll(
        ".ct-team-player"
      ) as NodeListOf<HTMLDivElement>;

      return Array.from(playersList).map((player) => {
        const playerName = player.querySelector("h2")?.textContent;
        const position = player.parentNode?.parentNode?.previousSibling
          ?.textContent as string;

        const positionFormatted = positions[position as keyof typeof positions];

        return { jogador: playerName, posição: positionFormatted };
      });
    }, positions);

    console.log(players);

    readlineSync.keyIn("\nDigite qualquer tecla para voltar ao menu: ");
  }

  private async mensMatches() {
    const games = await this.page.evaluate(() => {
      const nextMatches = document.querySelectorAll(
        ".ct-slide-item.next-match-slide.slick-slide"
      ) as NodeListOf<HTMLDivElement>;

      return Array.from(nextMatches).map((match) => {
        const championship = match.title.split("- ")[0].trim();
        const teams = match.title.split("- ")[1];
        const date = match
          .querySelector("p")
          ?.innerText.split("\n")[0]
          .split(" ")[0];
        const time = match
          .querySelector("p")
          ?.innerText.split("\n")[0]
          .split(" ")[1];
        const stadium = match.querySelector("p")?.innerText.split("\n")[1];

        return {
          campeonato: championship,
          times: teams,
          data: date,
          horário: time,
          estádio: stadium,
        };
      });
    });

    console.log(games);

    readlineSync.keyIn("\nDigite qualquer tecla para voltar ao menu: ");
  }

  private async womensMatches() {
    await this.page.click(".ct-hamburguer .hamburguer-icon");

    await this.page.click(".ct-flex-align-center.menu-left ::-p-text(Futebol)");

    await this.page.click(
      `.ct-submenu.ct-submenu-image .mt-3 ::-p-text(Calendário de Jogos)`
    );

    await this.page.waitForSelector("table");

    const games = await this.page.evaluate(() => {
      const lines = document.querySelectorAll(
        "table tr"
      ) as NodeListOf<HTMLTableRowElement>;
      const linesValid = Array.from(lines).filter((line) => {
        const columns = line.querySelectorAll("td");
        const date = columns[0].innerText
          .split("—")[0]
          .trim()
          .split("/")
          .reverse()
          .join("/");
        const dateValid = new Date(date) > new Date();

        return dateValid === true ? line : "";
      });

      return linesValid.map((line) => {
        const columns = line.querySelectorAll("td");
        const championship = columns[1].innerText.split("\n")[0].trim();
        const teams = columns[2].innerText;
        const date = columns[0].innerText.split("—")[0];
        const time = columns[0].innerText.split("—")[1];
        const stadium = columns[3].innerText;

        return {
          campeonato: championship,
          times: teams,
          data: date,
          horário: time,
          estádio: stadium,
        };
      });
    });

    console.log(games);

    readlineSync.keyIn("\nDigite qualquer tecla para voltar ao menu: ");
  }

  private async news() {
    await this.page.click(".ct-hamburguer .hamburguer-icon");

    await this.page.click(
      ".ct-flex-align-center.menu-right ::-p-text(NOTÍCIAS)"
    );

    await this.page.waitForSelector(".ct-news-list");

    const newsList = await this.page.evaluate(() => {
      const linksNews = document.querySelectorAll(
        ".ct-news-list-item-content a"
      ) as NodeListOf<HTMLAnchorElement>;

      return Array.from(linksNews).map((link) => {
        const linkNews = link.href;
        const title = link.querySelector("h4")?.innerText.split("\n")[0];
        const date = link
          .querySelector("h4")
          ?.innerText.split("\n")[2]
          .split("- ")[1]
          .split(" ")[0]
          .replace(/[.]/g, "/");
        const time = link
          .querySelector("h4")
          ?.innerText.split("\n")[2]
          .split("- ")[1]
          .split(" ")[1];

        return {
          link: linkNews,
          título: title,
          data: date,
          horário: time,
        };
      });
    });

    console.log(newsList);

    readlineSync.keyIn("\nDigite qualquer tecla para voltar ao menu: ");
  }
}

(async () => {
  const bot = await Bot.create();
  await bot.execute();
})();
