import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { within } from '@testing-library/dom';

import ProjectInsightNavigation from '../components/ProjectInsightNavigation';
import ProjectSearch from '../components/ProjectSearch';
import ProjectAbout from '../components/ProjectAbout';
import TwitterFeedItem from '../components/TwitterFeedItem';
import DiscordFeedItem from '../components/DiscordFeedItem';
import YouTubeFeedItem from '../components/YouTubeFeedItem';
import TelegramFeedItem from '../components/TelegramFeedItem';
import MediumFeedItem from '../components/MediumFeedItem';

class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const computeMinimumFractionDigits = (num) => {
    const numStr = num.toString();
    if (!numStr.includes(".")) {
        return 2;
    }

    const decimalsStr = numStr.split(".")[1];

    if (decimalsStr[0] != "0" || num >= 1) {
        return 2;
    }

    const numZeros = decimalsStr.split("0").length - 1;
    return numZeros + 2;
}

const projectSort = (project1, project2, sortBy) => {
    if (sortBy == "Alphabetical - A to Z") {
        return project1.name.localeCompare(project2.name);
    }
    else if (sortBy == "Alphabetical - Z to A") {
        return project2.name.localeCompare(project1.name);
    }
    else if (sortBy == "Market Cap - $ to $$$") {
        const marketCap1 = project1.marketCap ? parseInt(project1.marketCap) : 0;
        const marketCap2 = project2.marketCap ? parseInt(project2.marketCap) : 0;
        return marketCap1 - marketCap2;
    }
    else {
        const marketCap1 = project1.marketCap ? parseInt(project1.marketCap) : 0;
        const marketCap2 = project2.marketCap ? parseInt(project2.marketCap) : 0;
        return marketCap2 - marketCap1;
    }
  }

describe("Listing Platform Tests", () => {
    window.ResizeObserver = ResizeObserver;

    test("Project Insights Navigation Renders Properly", async () => {
        const screen = render(
            <ProjectInsightNavigation projectSearchClick={() => {}} />
        );

        const projectSearch = await screen.findByText(/Project Search*/i);
        const cardinalHouse = await screen.findByText(/Cardinal House*/i);
        const educationCenter = await screen.findByText(/Education Center*/i);
        const whitePaper = await screen.findByText(/White Paper*/i);
        const dapp = await screen.findByText(/DApp*/i);
        expect(projectSearch).toBeInTheDocument();
        expect(cardinalHouse).toBeInTheDocument();
        expect(educationCenter).toBeInTheDocument();
        expect(whitePaper).toBeInTheDocument();
        expect(dapp).toBeInTheDocument();
    }),

    test("Project Search Renders Properly", async () => {
        const tags = ["Test Tag 1", "Test Tag 2", "Test Tag 3"];
        const chains = ["Ethereum", "Polygon", "Binance", "Avalanche"];
        const tagCount = 3;
        const chainCount = 4;

        const screen = render(
            <ProjectSearch useDarkTheme={true} projects={mockProjects} tags={tags} chains={chains} 
                tagCount={tagCount} chainCount={chainCount} />
        );

        for (let i = 0; i < mockProjects.length; i++) {
            const mockProject = mockProjects[i];
            const projectContainer = await screen.findByTestId(`cryptoProject-${mockProject.name}`);
            expect(projectContainer).toBeInTheDocument();

            const projectTokenPrice = await within(projectContainer).findByTestId(`${mockProject.name}-tokenPrice`);
            expect(projectTokenPrice).toBeInTheDocument();
            expect(projectTokenPrice.textContent).toBe(`$${mockProject.tokenPrice.toLocaleString(undefined, {minimumFractionDigits: computeMinimumFractionDigits(mockProject.tokenPrice)})}`);

            const project24HourChange = await within(projectContainer).findByTestId(`${mockProject.name}-change24Hr`);
            expect(project24HourChange).toBeInTheDocument();
            expect(project24HourChange.textContent).toBe(`${mockProject.tokenPriceChangePercentage24hr?.toFixed(2).toString().replace("-", "")}%`);

            const projectChains = await within(projectContainer).findByTestId(`${mockProject.name}-chains`);
            expect(projectChains).toBeInTheDocument();
            expect(projectChains.textContent).toBe(mockProject.chains.replaceAll(",", ", "));

            const projectMarketCap = await within(projectContainer).findByTestId(`${mockProject.name}-marketCap`);
            expect(projectMarketCap).toBeInTheDocument();
            expect(projectMarketCap.textContent).toBe(`$${mockProject.marketCap?.toLocaleString()}`);

            const projectTags = await within(projectContainer).findByTestId(`${mockProject.name}-tags`);
            expect(projectTags).toBeInTheDocument();
            expect(projectTags.textContent).toBe(mockProject.tags.replaceAll(",", " | "));            
        }
    }),

    test("Project Search Categories Work", async () => {
        const tags = ["Test Tag 1", "Test Tag 2", "Test Tag 3"];
        const chains = ["Ethereum", "Polygon", "Binance", "Avalanche"];
        const tagCount = 3;
        const chainCount = 4;

        const screen = render(
            <ProjectSearch useDarkTheme={true} projects={mockProjects} tags={tags} chains={chains} 
                tagCount={tagCount} chainCount={chainCount} />
        );

        const categoryBtns = await screen.findAllByTestId(/category*/i);
        expect(categoryBtns.length).toBe(tagCount);

        await userEvent.click(categoryBtns[1]);
        const comingSoonText1 = await screen.findByText("NFTs Category Coming Soon!");
        expect(comingSoonText1).toBeInTheDocument();

        await userEvent.click(categoryBtns[2]);
        const comingSoonText2 = await screen.findByText("Businesses Category Coming Soon!");
        expect(comingSoonText2).toBeInTheDocument();

        await userEvent.click(categoryBtns[0]);
        const projectContainer = await screen.findByTestId(`cryptoProject-${mockProjects[0].name}`);
        expect(projectContainer).toBeInTheDocument();
    }),

    test("Project Tag Filter Works", async () => {
        const tags = ["Education", "Community", "NFT"];
        const chains = ["Ethereum", "Polygon", "Binance", "Avalanche"];
        const tagCount = 3;
        const chainCount = 4;

        const screen = render(
            <ProjectSearch useDarkTheme={true} projects={mockProjects} tags={tags} chains={chains} 
                tagCount={tagCount} chainCount={chainCount} />
        );

        const filterTagBtn = await screen.findByTestId("tagFilterBtn");
        await userEvent.click(filterTagBtn);

        const tagOptions = await screen.findAllByTestId(/tagOption-*/i);

        expect(tagOptions.length).toBe(tagCount);

        for (let i = 0; i < tagCount; i++) {
            const currTagOption = tagOptions[i];
            const currTag = currTagOption.textContent.split(" ")[0];
            await userEvent.click(currTagOption);
            
            const expectedProjects = JSON.parse(JSON.stringify(mockProjects)).filter((proj) => proj.tags.includes(currTag));
            const actualProjects = await screen.findAllByTestId(/cryptoProject*/i);

            expect(expectedProjects.length).toBe(actualProjects.length);
            expect(expectedProjects.length).toBeLessThan(mockProjects.length);

            await userEvent.click(await screen.findByTestId("unselect-all-tags"));
        }
    }),

    test("Project Chain Filter Works", async () => {
        const tags = ["Education", "Community", "NFT"];
        const chains = ["Ethereum", "Polygon", "Binance", "Avalanche"];
        const tagCount = 3;
        const chainCount = 4;

        const screen = render(
            <ProjectSearch useDarkTheme={true} projects={mockProjects} tags={tags} chains={chains} 
                tagCount={tagCount} chainCount={chainCount} />
        );

        const filterTagBtn = await screen.findByTestId("chainFilterBtn");
        await userEvent.click(filterTagBtn);

        const chainOptions = await screen.findAllByTestId(/chainOption-*/i);

        expect(chainOptions.length).toBe(chainCount);

        for (let i = 0; i < chainCount; i++) {
            const currChainOption = chainOptions[i];
            const currChain = currChainOption.textContent.split(" ")[0];
            await userEvent.click(currChainOption);
            
            const expectedProjects = JSON.parse(JSON.stringify(mockProjects)).filter((proj) => proj.chains.includes(currChain));
            const actualProjects = await screen.findAllByTestId(/cryptoProject*/i);

            expect(expectedProjects.length).toBe(actualProjects.length);
            expect(expectedProjects.length).toBeLessThan(mockProjects.length);

            await userEvent.click(await screen.findByTestId("unselect-all-chains"));
        }
    }),

    test("Project Sorting Works", async () => {
        const tags = ["Education", "Community", "NFT"];
        const chains = ["Ethereum", "Polygon", "Binance", "Avalanche"];
        const tagCount = 3;
        const chainCount = 4;

        const screen = render(
            <ProjectSearch useDarkTheme={true} projects={mockProjects} tags={tags} chains={chains} 
                tagCount={tagCount} chainCount={chainCount} />
        );

        const sortByBtn = await screen.findByTestId("sortByBtn");
        await userEvent.click(sortByBtn);

        const sortOptions = await screen.findAllByTestId(/sortOption-*/i);

        expect(sortOptions.length).toBe(4);

        for (let i = sortOptions.length - 1; i >= 0; i--) {
            const currSortOption = sortOptions[i];
            const currSortOptionText = currSortOption.textContent;
            
            await userEvent.click(currSortOption);

            const sortedProjects = JSON.parse(JSON.stringify(mockProjects)).sort((p1, p2) => projectSort(p1, p2, currSortOptionText));
            const actualProjects = await screen.findAllByTestId(/cryptoProject*/i);
            
            expect(sortedProjects.length).toBe(actualProjects.length);

            await userEvent.click(sortByBtn);
        }
    })

    test("Project Search Works", async () => {
        const tags = ["Education", "Community", "NFT"];
        const chains = ["Ethereum", "Polygon", "Binance", "Avalanche"];
        const tagCount = 3;
        const chainCount = 4;

        const screen = render(
            <ProjectSearch useDarkTheme={true} projects={mockProjects} tags={tags} chains={chains} 
                tagCount={tagCount} chainCount={chainCount} />
        );

        const projectSearchInput = await screen.findByTestId("project-search");
        
        let search = "Cardinal";
        await userEvent.type(projectSearchInput, search);

        let expectedProjects = mockProjects.filter((proj) => proj.name.includes(search));
        let actualProjects = await screen.findAllByTestId(/cryptoProject*/i);

        expect(actualProjects.length).toBe(expectedProjects.length);
        expect(expectedProjects.length).toBeLessThan(mockProjects.length);

        search = "{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}Test Project";
        await userEvent.type(projectSearchInput, search);

        search = "Test Project"
        expectedProjects = mockProjects.filter((proj) => proj.name.includes(search));
        actualProjects = await screen.findAllByTestId(/cryptoProject*/i);

        expect(actualProjects.length).toBe(expectedProjects.length);
        expect(expectedProjects.length).toBeLessThan(mockProjects.length);
    }),

    test("Project About Page Renders Properly", async () => {
        const project = mockProjects[0];
        const dummyPriceData = {"prices":[[1645574400000,38337.2038554348],[1645660800000,37372.2926803477],[1645747200000,38363.345488570165],[1645833600000,39316.16207578596],[1645920000000,39090.202153609054],[1646006400000,37803.59016044929],[1646092800000,43225.404677435734],[1646179200000,44459.59162774341],[1646265600000,43980.707382090906],[1646352000000,42491.97839335905],[1646438400000,39200.29973557414],[1646524800000,39463.14681149058],[1646611200000,38442.99174588676],[1646697600000,38076.49382252028],[1646784000000,38732.93701302586],[1646870400000,41986.03444607623],[1646956800000,39468.35477300189],[1647043200000,38775.17558840679],[1647129600000,38903.69354800599],[1647216000000,37852.52514106289],[1647302400000,39669.423812004505]]};
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(dummyPriceData),
                ok: true
            })
        );

        const screen = render(
            <ProjectAbout project={project} />
        );

        const projectTitle = await screen.findAllByText(new RegExp(project.name, "i"));
        expect(projectTitle.length).toBeGreaterThan(0);

        const marketCap = await screen.findByTestId("marketCap");
        expect(marketCap).toBeInTheDocument();
        expect(marketCap.textContent).toBe(`$${project.marketCap?.toLocaleString()}`);

        const tradingVolume = await screen.findByTestId("24HrTradingVolume");
        expect(tradingVolume).toBeInTheDocument();
        expect(tradingVolume.textContent).toBe(`$${project.tradingVolume24hr?.toLocaleString()}`);

        const fullyDilutedMarketCap = await screen.findByTestId("fullyDilutedMarketCap");
        expect(fullyDilutedMarketCap).toBeInTheDocument();
        expect(fullyDilutedMarketCap.textContent).toBe("?");

        const circulatingSupply = await screen.findByTestId("circulatingSupply");
        expect(circulatingSupply).toBeInTheDocument();
        expect(circulatingSupply.textContent).toBe(`${Number(project.circulatingSupply.toFixed(2)).toLocaleString()}`);

        const totalSupply = await screen.findByTestId("totalSupply");
        expect(totalSupply).toBeInTheDocument();
        expect(totalSupply.textContent).toBe(`${Number(project.totalSupply.toFixed(2)).toLocaleString()}`);

        const description = await screen.findByTestId("description");
        expect(description).toBeInTheDocument();
        expect(description.textContent).toBe(project.description.replace("&amp;", "&").replaceAll(" NEWLINE ", "\n\n"));

        const educationAndTutorials = await screen.findByText(/Education and Tutorials/i);
        expect(educationAndTutorials).toBeInTheDocument();

        const purchaseTokens = await screen.findByText(/Purchase Tokens Here/i);
        expect(purchaseTokens).toBeInTheDocument();

        const website = await screen.findByText(/Website/i);
        expect(website).toBeInTheDocument();

        const whitePaper = await screen.findByText(/White Paper/i);
        expect(whitePaper).toBeInTheDocument();
    }),

    test("Twitter Feed Item Renders Properly", async () => {
        const project = mockProjects[1];
        const feed = {
            timestamp: (new Date()).toISOString(),
            text: "&amp;&amp;Test Twitter Post&amp;&amp;",
            link: "https://twitter.com"
        };

        const screen = render(
            <TwitterFeedItem feed={feed} project={project} />
        );

        const timestampText = await screen.findByText(/a few seconds ago/i);
        expect(timestampText).toBeInTheDocument();

        const projectNames = await screen.findAllByText(new RegExp(project.name, "i"));
        expect(projectNames.length).toBeGreaterThan(0);

        const projectTwitterHandle = await screen.findByText(new RegExp(`@${project.twitter.split("/").at(-1)}`, "i"));
        expect(projectTwitterHandle).toBeInTheDocument();

        const feedText = await screen.findByText(feed.text.replace("&amp;", "&"));
        expect(feedText).toBeInTheDocument();

        expect(await screen.getByText('View on Twitter').closest('a')).toHaveAttribute('href', feed.link);
    }), 

    test("Discord Feed Item Renders Properly", async () => {
        const project = mockProjects[2];
        const feed = {
            timestamp: (new Date()).toISOString(),
            text: "Test Discord Announcement",
            link: "https://discord.com"
        };

        const screen = render(
            <DiscordFeedItem feed={feed} project={project} />
        );

        const timestampText = await screen.findByText(/a few seconds ago/i);
        expect(timestampText).toBeInTheDocument();

        const projectNames = await screen.findAllByText(new RegExp(project.name, "i"));
        expect(projectNames.length).toBeGreaterThan(0);

        const feedText = await screen.findByText(feed.text);
        expect(feedText).toBeInTheDocument();

        expect(await screen.getByText('View on Discord').closest('a')).toHaveAttribute('href', feed.link);
    }),
    
    test("YouTube Feed Item Renders Properly", async () => {
        const project = mockProjects[2];
        const feed = {
            timestamp: (new Date()).toISOString(),
            text: "Test YouTube Video",
            link: "https://youtube.com"
        };

        const screen = render(
            <YouTubeFeedItem feed={feed} project={project} />
        );

        const timestampText = await screen.findByText(/a few seconds ago/i);
        expect(timestampText).toBeInTheDocument();

        const projectNames = await screen.findAllByText(new RegExp(project.name, "i"));
        expect(projectNames.length).toBeGreaterThan(0);

        const feedText = await screen.findByText(feed.text);
        expect(feedText).toBeInTheDocument();

        expect(await screen.getByText('View on YouTube').closest('a')).toHaveAttribute('href', feed.link);
    }),

    test("Telegram Feed Item Renders Properly", async () => {
        const project = mockProjects[0];
        const feed = {
            timestamp: (new Date()).toISOString(),
            text: "Test Telegram Announcement"
        };

        const screen = render(
            <TelegramFeedItem feed={feed} project={project} />
        );

        const timestampText = await screen.findByText(/a few seconds ago/i);
        expect(timestampText).toBeInTheDocument();

        const projectNames = await screen.findAllByText(new RegExp(project.name, "i"));
        expect(projectNames.length).toBeGreaterThan(0);

        const feedText = await screen.findByText(feed.text);
        expect(feedText).toBeInTheDocument();
    }),
    
    test("Medium Feed Item Renders Properly", async () => {
        const project = mockProjects[2];
        const feed = {
            timestamp: (new Date()).toISOString(),
            text: "Test Medium Post",
            link: "https://medium.com"
        };

        const screen = render(
            <MediumFeedItem feed={feed} project={project} />
        );

        const timestampText = await screen.findByText(/a few seconds ago/i);
        expect(timestampText).toBeInTheDocument();

        const projectNames = await screen.findAllByText(new RegExp(project.name, "i"));
        expect(projectNames.length).toBeGreaterThan(0);

        const projectMediumHandle = await screen.findByText(new RegExp(`@${project.mediumUsername.split("/").at(-1)}`, "i"));
        expect(projectMediumHandle).toBeInTheDocument();        

        const feedText = await screen.findByText(feed.text);
        expect(feedText).toBeInTheDocument();

        expect(await screen.getByText('View on Medium').closest('a')).toHaveAttribute('href', feed.link);
    })    
})

const mockProjects = [
    {
        "name": "Cardinal House",
        "description": "Cardinal House is a blockchain ecosystem with a focus on education, community, and crypto services that benefit everyone involved",
        "addedDate": "2022-11-01T00:00:00.000+00:00",
        "youtube": "youtube.com/c/CardinalHouse",
        "youtubeId": "UC1dUX-MzSWJ046vYP2215-g",
        "twitter": "https://twitter.com/CardinalHouse1",
        "twitterId": "1505986271885369347",
        "twitterEmbed": "<a class=\"twitter-timeline\" href=\"https://twitter.com/CardinalHouse1?ref_src=twsrc%5Etfw\">Tweets by CardinalHouse1</a> <script async src=\"https://platform.twitter.com/widgets.js\" charset=\"utf-8\"></script>",
        "mediumUsername": "@SphereFinance_",
        "discordAnnouncementChannelId": "534897053495",
        "telegram": "https://t.me/CardinalHousechat",
        "discordInviteLink": "discord invite link",
        "tokenLink": "https://www.pancakeswap.finance",
        "website": "https://www.cardinalhouse.finance/",
        "whitepaper": "white paper link",
        "collectionName": "CardinalHouse",
        "logoUrl": "https://i.imgur.com/mpF81ke.png",
        "id": "cardinal-house",
        "chartLink": "https://www.dexscreener.com",
        "educationLink": "https://www.cardinalhouse.finance/educationcenter",
        "tags": "Community,NFT",
        "chains": "Polygon",
        "marketCap": 400,
        "circulatingSupply": 7671878344.87752,
        "fullyDilutedMarketCap": -1,
        "totalSupply": 8964103688.80964,
        "tokenPrice": 0.00486883,
        "tokenPriceChangePercentage24hr": -15.8607,
        "coinGeckoTokenId": "sphere-finance",
        "tradingVolume24hr": 203015,
        "tokenName": "Cardinal Token",
        "tokenSymbol": "CRNL",
        "tradingViewId": "BINANCE:LINKUSDT",
        "tokenAddresses": "{'platforms': {'polygon-pos': '0x62f594339830b90ae4c084ae7d223ffafd9658a7'}, 'detail_platforms': {'polygon-pos': {'decimal_place': 18, 'contract_address': '0x62f594339830b90ae4c084ae7d223ffafd9658a7'}}}"
      },
    {
        "name": "First Test Project",
        "description": "This is a test project, the first of its kind.",
        "addedDate": "2022-11-01T00:00:00.000+00:00",
        "youtube": "youtube.com/c/CardinalHouse",
        "youtubeId": "UC1dUX-MzSWJ046vYP2215-g",
        "twitter": "https://twitter.com/CardinalHouse1",
        "twitterId": "1505986271885369347",
        "twitterEmbed": "<a class=\"twitter-timeline\" href=\"https://twitter.com/CardinalHouse1?ref_src=twsrc%5Etfw\">Tweets by CardinalHouse1</a> <script async src=\"https://platform.twitter.com/widgets.js\" charset=\"utf-8\"></script>",
        "mediumUsername": "@SphereFinance_",
        "discordAnnouncementChannelId": "534897053495",
        "telegram": "https://t.me/CardinalHousechat",
        "discordInviteLink": "discord invite link",
        "tokenLink": "https://www.pancakeswap.finance",
        "website": "https://www.cardinalhouse.finance/",
        "whitepaper": "white paper link",
        "collectionName": "CardinalHouse",
        "logoUrl": "https://i.imgur.com/mpF81ke.png",
        "id": "test-project",
        "chartLink": "https://www.dexscreener.com",
        "educationLink": "https://www.cardinalhouse.finance/educationcenter",
        "tags": "Education,Community",
        "chains": "Ethereum,Avalanche",
        "marketCap": 200,
        "circulatingSupply": 7671878344.87752,
        "fullyDilutedMarketCap": 7671878344.5467,
        "totalSupply": 8964103688.80964,
        "tokenPrice": 0.00486883,
        "tokenPriceChangePercentage24hr": -15.8607,
        "coinGeckoTokenId": "sphere-finance",
        "tradingVolume24hr": 203015,
        "tokenName": "Test Token",
        "tokenSymbol": "TEST",
        "tradingViewId": "BINANCE:LINKUSDT",
        "tokenAddresses": "{'platforms': {'polygon-pos': '0x62f594339830b90ae4c084ae7d223ffafd9658a7'}, 'detail_platforms': {'polygon-pos': {'decimal_place': 18, 'contract_address': '0x62f594339830b90ae4c084ae7d223ffafd9658a7'}}}"
      },
    {
        "name": "Second Test Project",
        "description": "This is a test project, the second of its kind.",
        "addedDate": "2022-11-01T00:00:00.000+00:00",
        "youtube": "youtube.com/c/CardinalHouse",
        "youtubeId": "UC1dUX-MzSWJ046vYP2215-g",
        "twitter": "https://twitter.com/CardinalHouse1",
        "twitterId": "1505986271885369347",
        "twitterEmbed": "<a class=\"twitter-timeline\" href=\"https://twitter.com/CardinalHouse1?ref_src=twsrc%5Etfw\">Tweets by CardinalHouse1</a> <script async src=\"https://platform.twitter.com/widgets.js\" charset=\"utf-8\"></script>",
        "mediumUsername": "@SphereFinance_",
        "discordAnnouncementChannelId": "534897053495",
        "telegram": "https://t.me/CardinalHousechat",
        "discordInviteLink": "discord invite link",
        "tokenLink": "https://www.pancakeswap.finance",
        "website": "https://www.cardinalhouse.finance/",
        "whitepaper": "white paper link",
        "collectionName": "CardinalHouse",
        "logoUrl": "https://i.imgur.com/mpF81ke.png",
        "id": "test-project-2",
        "chartLink": "https://www.dexscreener.com",
        "educationLink": "https://www.cardinalhouse.finance/educationcenter",
        "tags": "NFT",
        "chains": "Binance,Ethereum",
        "marketCap": 300,
        "circulatingSupply": 7671878344.87752,
        "fullyDilutedMarketCap": 37464065,
        "totalSupply": 8964103688.80964,
        "tokenPrice": 0.00486883,
        "tokenPriceChangePercentage24hr": -15.8607,
        "coinGeckoTokenId": "sphere-finance",
        "tradingVolume24hr": 203015,
        "tokenName": "Test Token 2",
        "tokenSymbol": "TESTT",
        "tradingViewId": "BINANCE:LINKUSDT",
        "tokenAddresses": "{'platforms': {'polygon-pos': '0x62f594339830b90ae4c084ae7d223ffafd9658a7'}, 'detail_platforms': {'polygon-pos': {'decimal_place': 18, 'contract_address': '0x62f594339830b90ae4c084ae7d223ffafd9658a7'}}}"
      },
];