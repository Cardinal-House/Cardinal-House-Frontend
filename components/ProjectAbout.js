import { Grid, Typography, Button, Menu, MenuItem, Tooltip, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import Image from 'next/image';
import { FaTwitter, FaTelegram, FaDiscord, FaYoutube, FaMedium } from 'react-icons/fa';
import { IconContext } from "react-icons";

import styles from '../styles/EducationCenter.module.css';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ContentCopy from '@mui/icons-material/ContentCopy';

import metaMaskLogo from '../public/MetaMask.png';

const callAPI = async (url) => {
	let response = await fetch(url, {
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
	});
	if (!response.ok) {
		const message = `An error has occured: ${response.status}`;
		throw new Error(message);
	}
	return response.json();
};

export default function ProjectAbout({ project }) {
	const [isLoading, setIsLoading] = useState(true);
    const [priceData, setPriceData] = useState({});
    const [chartViewing, setChartViewing] = useState("price");
    const [tokenMenuAnchor, setTokenMenuAnchor] = useState(null);
    const [showCopy, setShowCopy] = useState(false);

    const tokenAddresses = project.tokenAddresses ? (0, eval)('(' + project.tokenAddresses.replaceAll("None", "''") + ')') : {};
    const tokenMenuOpen = Boolean(tokenMenuAnchor);

	useEffect(() => {
		fetchData().then((chartData) => {
			setIsLoading(false);
			setPriceData(chartData);
            initChart(chartData);
		});
		const timerID = setInterval(() => {
			fetchData().then((chartData) => {
				setPriceData(chartData);
			});
		}, 1000 * 30);
		return () => {
			clearInterval(timerID);
		};
	}, []);

	const fetchData = async () => {
		let result = await callAPI(`https://api.coingecko.com/api/v3/coins/${project.coinGeckoTokenId}/market_chart?vs_currency=usd&days=365&interval=1m`);
		return result.prices;
	};

    async function addToMetaMask(tokenAddress, decimals) {
        try {
            await ethereum.request({
              method: 'wallet_watchAsset',
              params: {
                type: 'ERC20',
                options: {
                  address: tokenAddress,
                  symbol: project.tokenSymbol,
                  decimals: decimals,
                  image: project.logoUrl,
                },
              },
            });
          } catch (error) {
            console.log(error);
          }        
    }

    async function copyText(textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(function() {
            setShowCopy(true);
        }, function(err) {
            console.error('Async: Could not copy text: ', err);
        });
    }

	const initChart = (data) => {
        new TradingView.widget({
            "autosize": true,
            "symbol": project.tradingViewId,
            "interval": "D",
            "timezone": "Etc/UTC",
            "theme": "dark",
            "style": "1",
            "locale": "en",
            "toolbar_bg": "#f1f3f6",
            "enable_publishing": false,
            "hide_side_toolbar": false,
            "allow_symbol_change": true,
            "container_id": "tradingview_309d5"
        });

        // Create the chart
        Highcharts.theme = {
            colors: [
                '#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066',
                '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'
            ],
            chart: {
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
                    stops: [
                        [0, '#0f1220'],
                        [1, '#0f1220']
                    ]
                },
                style: {
                    fontFamily: '\'Unica One\', sans-serif'
                },
                plotBorderColor: '#606063'
            },
            title: {
                style: {
                    color: '#E0E0E3',
                    textTransform: 'uppercase',
                    fontSize: '20px'
                }
            },
            subtitle: {
                style: {
                    color: '#E0E0E3',
                    textTransform: 'uppercase'
                }
            },
            xAxis: {
                gridLineColor: '#707073',
                labels: {
                    style: {
                        color: '#E0E0E3'
                    }
                },
                lineColor: '#707073',
                minorGridLineColor: '#505053',
                tickColor: '#707073',
                title: {
                    style: {
                        color: '#A0A0A3'
    
                    }
                }
            },
            yAxis: {
                gridLineColor: '#707073',
                labels: {
                    style: {
                        color: '#E0E0E3'
                    }
                },
                lineColor: '#707073',
                minorGridLineColor: '#505053',
                tickColor: '#707073',
                tickWidth: 1,
                title: {
                    style: {
                        color: '#A0A0A3'
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                style: {
                    color: '#F0F0F0'
                }
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        color: '#F0F0F3',
                        style: {
                            fontSize: '13px'
                        }
                    },
                    marker: {
                        lineColor: '#333'
                    }
                },
                boxplot: {
                    fillColor: '#505053'
                },
                candlestick: {
                    lineColor: 'white'
                },
                errorbar: {
                    color: 'white'
                }
            },
            legend: {
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                itemStyle: {
                    color: '#E0E0E3'
                },
                itemHoverStyle: {
                    color: '#FFF'
                },
                itemHiddenStyle: {
                    color: '#606063'
                },
                title: {
                    style: {
                        color: '#C0C0C0'
                    }
                }
            },
            credits: {
                style: {
                    color: '#666'
                }
            },
            labels: {
                style: {
                    color: '#707073'
                }
            },
    
            drilldown: {
                activeAxisLabelStyle: {
                    color: '#F0F0F3'
                },
                activeDataLabelStyle: {
                    color: '#F0F0F3'
                }
            },
    
            navigation: {
                buttonOptions: {
                    symbolStroke: '#DDDDDD',
                    theme: {
                        fill: '#505053'
                    }
                }
            },
    
            // scroll charts
            rangeSelector: {
                buttonTheme: {
                    fill: '#505053',
                    stroke: '#000000',
                    style: {
                        color: '#CCC'
                    },
                    states: {
                        hover: {
                            fill: '#707073',
                            stroke: '#000000',
                            style: {
                                color: 'white'
                            }
                        },
                        select: {
                            fill: '#000003',
                            stroke: '#000000',
                            style: {
                                color: 'white'
                            }
                        }
                    }
                },
                inputBoxBorderColor: '#505053',
                inputStyle: {
                    backgroundColor: '#333',
                    color: 'silver'
                },
                labelStyle: {
                    color: 'silver'
                }
            },
    
            navigator: {
                handles: {
                    backgroundColor: '#666',
                    borderColor: '#AAA'
                },
                outlineColor: '#CCC',
                maskFill: 'rgba(255,255,255,0.1)',
                series: {
                    color: '#7798BF',
                    lineColor: '#A6C7ED'
                },
                xAxis: {
                    gridLineColor: '#505053'
                }
            },
    
            scrollbar: {
                barBackgroundColor: '#808083',
                barBorderColor: '#808083',
                buttonArrowColor: '#CCC',
                buttonBackgroundColor: '#606063',
                buttonBorderColor: '#606063',
                rifleColor: '#FFF',
                trackBackgroundColor: '#404043',
                trackBorderColor: '#404043'
            }
        };

        // Apply the theme
        Highcharts.setOptions(Highcharts.theme);
        
        Highcharts.stockChart('highChartDiv', {
            rangeSelector: {
                selected: 1
            },

            title: {
                text: ''
            },
            yAxis: {
                tickPixelInterval: 40
            },
            series: [{
                name: project.tokenSymbol,
                data: data,
                tooltip: {
                    valueDecimals: 6
                }
            }]
        });
	};  

    return (
        <Grid container justifyContent="center" alignItems="center" spacing={4}>
            <Snackbar open={showCopy} autoHideDuration={6000} onClose={() => {setShowCopy(false)}}>
                <MuiAlert elevation={6} variant="filled" onClose={() => {setShowCopy(false)}} severity="success" sx={{ width: '100%' }} className="mobileSnackbarTextSize" >
                    Address Copied!
                </MuiAlert>
            </Snackbar>
            {
                project.tokenPrice && project.tokenPrice > 0 && (
                    <Grid item lg={6} md={12} sm={12} xs={12} className={styles.marketDataGrid}>
                        <Grid container justifyContent="center" alignItems="center" spacing={4}>
                            <Grid item xs={12} className="pb-4">
                                <div className="pb-2">
                                    <img src={project.logoUrl} width="35" height="35" style={{borderRadius: '50%', marginTop: '-1%'}} />
                                    <b className={styles.projectTokenText}>&nbsp;{project.name} ({project.tokenSymbol})</b>
                                </div>
                                <Typography variant="p">
                                    <b className={styles.tokenPriceText}>${project.tokenPrice.toLocaleString()}</b>&nbsp;&nbsp;&nbsp;
                                    {
                                        project.tokenPriceChangePercentage24hr >= 0 && (
                                            <b className={styles.percentageTextLarge} style={{color: 'green'}}>
                                                <ArrowDropUpIcon/> 
                                                {project.tokenPriceChangePercentage24hr.toFixed(2)}%
                                            </b>
                                        )
                                    }
                                    {
                                        project.tokenPriceChangePercentage24hr < 0 && (
                                            <b className={styles.percentageTextLarge} style={{color: 'red'}}>
                                                <ArrowDropDownIcon/> 
                                                {project.tokenPriceChangePercentage24hr.toFixed(2) * -1}%
                                            </b>
                                        )
                                    }
                                </Typography>                        
                                <Typography variant="p">
                                </Typography>
                            </Grid>
                            {
                                project.marketCap && (
                                    <Grid item xs={12} className={styles.marketDataGridItem}>
                                        <div className={styles.marketDataDiv}>
                                            <Typography variant="p" className={styles.marketDataTitleText}>
                                                Market Cap
                                            </Typography>
                                            <Typography variant="p" className={styles.marketDataText}>
                                                {project.marketCap > 0 ? `$${Number(project.marketCap).toLocaleString()}` : "?"}
                                            </Typography>
                                        </div>
                                    </Grid>
                                )
                            }
                            {
                                project.tradingVolume24hr && (
                                    <Grid item xs={12} className={styles.marketDataGridItem}>
                                        <div className={styles.marketDataDiv}>
                                            <Typography variant="p" className={styles.marketDataTitleText}>
                                                24 Hour Trading Volume
                                            </Typography>
                                            <Typography variant="p" className={styles.marketDataText}>
                                                {project.tradingVolume24hr > 0 ? `$${Number(project.tradingVolume24hr).toLocaleString()}` : "?"}                                    
                                            </Typography>
                                        </div>
                                    </Grid>
                                )
                            }
                            {
                                project.fullyDilutedMarketCap && (
                                    <Grid item xs={12} className={styles.marketDataGridItem}>
                                        <div className={styles.marketDataDiv}>
                                            <Typography variant="p" className={styles.marketDataTitleText}>
                                                Fully Diluted Market Cap
                                            </Typography>
                                            <Typography variant="p" className={styles.marketDataText}>
                                                {project.fullyDilutedMarketCap > 0 ? `$${Number(project.fullyDilutedMarketCap).toLocaleString()}` : "?"}
                                            </Typography>
                                        </div>
                                    </Grid>
                                )
                            }
                            {
                                project.circulatingSupply && (
                                    <Grid item xs={12} className={styles.marketDataGridItem}>
                                        <div className={styles.marketDataDiv}>
                                            <Typography variant="p" className={styles.marketDataTitleText}>
                                                Circulating Supply
                                            </Typography>
                                            <Typography variant="p" className={styles.marketDataText}>
                                                {project.circulatingSupply > 0 ? `${Number(project.circulatingSupply.toFixed(2)).toLocaleString()}` : "?"}                                               
                                            </Typography>
                                        </div>
                                    </Grid>
                                )
                            }
                            {
                                project.totalSupply && (
                                    <Grid item xs={12} className={styles.marketDataGridItem}>
                                        <div className={styles.marketDataDiv}>
                                            <Typography variant="p" className={styles.marketDataTitleText}>
                                                Total Supply
                                            </Typography>
                                            <Typography variant="p" className={styles.marketDataText}>
                                                {project.totalSupply > 0 ? `${Number(project.totalSupply.toFixed(2)).toLocaleString()}` : "?"}
                                            </Typography>
                                        </div>
                                    </Grid>
                                )
                            }
                        </Grid>
                    </Grid>
                )
            }
            <Grid item lg={6} md={6} sm={12} xs={12}>
                <Grid container justifyContent="center" alignItems="center" spacing={4}>
                    {
                        Object.keys(tokenAddresses).length > 0 && tokenAddresses.platforms && tokenAddresses.platforms[Object.keys(tokenAddresses.platforms)[0]].length > 10 && (
                            <>
                            <Grid item xs={12}>
                                <Typography variant="h3">
                                    Contracts
                                </Typography>
                            </Grid>

                            {
                                Object.keys(tokenAddresses.platforms).length == 1 && (
                                    <Grid item xs={12}>
                                        {tokenAddresses.platforms && [Object.keys(tokenAddresses.platforms)[0]].map((platform) => (
                                            <Button key={platform} variant="contained" className={clsx(styles.projectAboutBtns, styles.largeProjectAboutBtn)}>
                                                <Typography variant="p" key={platform} className={styles.contractText} onClick={() => copyText(tokenAddresses.platforms[platform])}>
                                                    {`${platform}: ${tokenAddresses.platforms[platform].slice(0, 6)}...${tokenAddresses.platforms[platform].slice(-7)}`}
                                                </Typography>
                                                &nbsp;
                                                &nbsp;
                                                <Tooltip title="Copy Address" placement="top">
                                                    <ContentCopy onClick={() => copyText(tokenAddresses.platforms[platform])} />
                                                </Tooltip>
                                                &nbsp;
                                                <Tooltip title="Add to MetaMask" placement="top">
                                                    <div>
                                                        <Image src={metaMaskLogo} width={25} height={25} layout="fixed" className={styles.metaMaskLogo}
                                                            onClick={() => addToMetaMask(tokenAddresses.platforms[platform], tokenAddresses.detail_platforms[platform].decimal_place)} />
                                                    </div>
                                                </Tooltip>
                                            </Button>
                                        ))}   
                                    </Grid>
                                )
                            }

                            {
                                Object.keys(tokenAddresses.platforms).length > 1 && (
                                    <Grid item xs={12}>
                                        <Button varian="contained" className={clsx(styles.projectAboutBtns, styles.largeProjectAboutBtn)} >
                                            {tokenAddresses.platforms && [Object.keys(tokenAddresses.platforms)[0]].map((platform) => (
                                                <>
                                                    <Typography variant="p" key={platform} className={styles.contractText} onClick={() => copyText(tokenAddresses.platforms[platform])}>
                                                        {`${platform}: ${tokenAddresses.platforms[platform].slice(0, 6)}...${tokenAddresses.platforms[platform].slice(-7)}`}
                                                    </Typography>
                                                    &nbsp;
                                                    &nbsp;
                                                    <Tooltip title="Copy Address" placement="top">
                                                        <ContentCopy onClick={() => copyText(tokenAddresses.platforms[platform])} />
                                                    </Tooltip>
                                                    &nbsp;
                                                    <Tooltip title="Add to MetaMask" placement="top">
                                                        <div>
                                                            <Image src={metaMaskLogo} width={25} height={25} layout="fixed" className={styles.metaMaskLogo}
                                                                onClick={() => addToMetaMask(tokenAddresses.platforms[platform], tokenAddresses.detail_platforms[platform].decimal_place)} />
                                                        </div>
                                                    </Tooltip>
                                                    &nbsp;
                                                    <ArrowDropDownIcon onClick={(e) => setTokenMenuAnchor(e.currentTarget.parentElement)} />
                                                </>
                                            ))}
                                        </Button>
        
                                        <Menu anchorEl={tokenMenuAnchor} className={styles.filterDropdown} open={tokenMenuOpen} onClose={() => setTokenMenuAnchor(null)}>                      
                                            {tokenAddresses.platforms && Object.keys(tokenAddresses.platforms).slice(1).map((platform) => (
                                                <MenuItem key={platform}>
                                                    <Typography variant="p" className={styles.contractText} onClick={() => copyText(tokenAddresses.platforms[platform])}>
                                                        {`${platform}: ${tokenAddresses.platforms[platform].slice(0, 8)}...${tokenAddresses.platforms[platform].slice(-10)}`}
                                                    </Typography>
                                                    &nbsp;
                                                    <Tooltip title="Copy Address" placement="top">
                                                        <ContentCopy onClick={() => copyText(tokenAddresses.platforms[platform])} />
                                                    </Tooltip>
                                                    &nbsp;
                                                    <Tooltip title="Add to MetaMask" placement="top">
                                                        <div>
                                                            <Image src={metaMaskLogo} width={25} height={25} layout="fixed" className={styles.metaMaskLogo}
                                                                onClick={() => addToMetaMask(tokenAddresses.platforms[platform], tokenAddresses.detail_platforms[platform].decimal_place)} />
                                                        </div>
                                                    </Tooltip>
                                                </MenuItem>
                                            ))}             
                                        </Menu>  
                                    </Grid>
                                )
                            }  
                            </>
                        )
                    }
                    <Grid item xs={12}>
                        <Typography variant="h3">
                            Other Links
                        </Typography>
                    </Grid>
                    {
                        project.educationLink && (
                            <Grid item xs={12}>
                                <Button href={project.educationLink} size="medium" variant="contained" className={styles.projectAboutBtns} target="_blank" rel="noreferrer">
                                    Education and Tutorials
                                </Button>
                            </Grid>
                        )
                    }
                    {
                        project.tokenLink && (
                            <Grid item xs={12}>
                                <Button href={project.tokenLink} size="medium" variant="contained" className={styles.projectAboutBtns} target="_blank" rel="noreferrer">
                                    Purchase Tokens Here
                                </Button>
                            </Grid>
                        )
                    }
                    {
                        project.website && (
                            <Grid item xs={12}>
                                <Button href={project.website} size="medium" variant="contained" className={styles.projectAboutBtns} target="_blank" rel="noreferrer">
                                    Website
                                </Button>
                            </Grid>
                        )
                    }
                    {
                        project.whitepaper && (
                            <Grid item xs={12}>
                                <Button href={project.whitepaper} size="medium" variant="contained" className={styles.projectAboutBtns} target="_blank" rel="noreferrer">
                                    White Paper
                                </Button>
                            </Grid>
                        )
                    }        
                    <Grid item lg={3} md={3} sm={6} xs={6}> 
                        <IconContext.Provider value={{ color: "#00FFC8" }} className={styles.socialIcons}>
                            <Grid container justifyContent="center" alignItems="center" spacing={4} className={styles.socialIcons}>
                                {
                                    project.discordInviteLink && (
                                        <Grid item xs={4} className={styles.socialIcon}>
                                            <a href={project.discordInviteLink} target="_blank" rel="noreferrer">
                                                <FaDiscord className={styles.iconSize} />
                                            </a>
                                        </Grid>
                                    )
                                }
                                {
                                    project.twitter && (
                                        <Grid item xs={4} className={clsx(styles.socialIcon, styles.socialIconSpacing)}>
                                            <a href={project.twitter} target="_blank" rel="noreferrer">
                                                <FaTwitter className={styles.iconSize} />
                                            </a>
                                        </Grid>
                                    )
                                }
                                {
                                    project.youtube && (
                                        <Grid item xs={4} className={clsx(styles.socialIcon, styles.socialIconSpacing)}>
                                            <a href={project.youtube} target="_blank" rel="noreferrer">
                                                <FaYoutube className={styles.iconSize} />
                                            </a>
                                        </Grid>
                                    )
                                }
                                {
                                    project.telegram && (
                                        <Grid item xs={4} className={clsx(styles.socialIcon, styles.socialIconSpacing)}>
                                            <a href={project.telegram} target="_blank" rel="noreferrer">
                                                <FaTelegram className={styles.iconSize} />
                                            </a>
                                        </Grid>
                                    )
                                }
                                {
                                    project.medium && (
                                        <Grid item xs={4} className={clsx(styles.socialIcon, styles.socialIconSpacing)}>
                                            <a href={project.medium} target="_blank" rel="noreferrer">
                                                <FaMedium className={styles.iconSize} />
                                            </a>
                                        </Grid>
                                    )
                                }
    
                            </Grid>
                        </IconContext.Provider>     
                    </Grid>      
                </Grid>
            </Grid>

            <Grid item xs={12} className={styles.chartBtnGrid}>
                <Button onClick={() => setChartViewing("price")} size="medium" variant="contained" 
                    className={clsx(chartViewing == "price" ? styles.selectedChartBtn : "", styles.chartBtn)}>
                    Price
                </Button>
                <Button onClick={() => setChartViewing("candle")} size="medium" variant="contained"
                    className={clsx(chartViewing == "candle" ? styles.selectedChartBtn : "", styles.chartBtn)}>
                    Candle
                </Button>
            </Grid>

            <Grid item lg={2} md={0} sm={0} xs={0}></Grid>   
            <Grid item lg={8} md={12} sm={12} xs={12} className={chartViewing == "candle" ? "hide" : ""}>
                <div className={styles.chartDiv} id="highChartDiv"></div>
            </Grid>
            <Grid item lg={8} md={12} sm={12} xs={12} className={chartViewing == "price" ? "hide" : ""}>
                <div className="tradingview-widget-container">
                    <div className={clsx("tradingViewDiv", styles.chartDiv)} id="tradingview_309d5"></div>
                    <div className="tradingview-widget-copyright"><a href="https://www.tradingview.com/symbols/BTCUSDT/" rel="noopener" target="_blank"><span className="blue-text">Charts</span></a> by TradingView</div>
                </div>
            </Grid>
            <Grid item lg={2} md={0} sm={0} xs={0}></Grid>

            <Grid item lg={8} md={10} sm={10} xs={12} className="mt-5 mb-5">
                <Typography variant="h2" className="mb-4">
                    What is {project.name} ({project.tokenSymbol})?
                </Typography>
                <Typography variant="h3">
                    {project.description.replace("&amp;", "&")}
                </Typography>
            </Grid>
        </Grid>
    )
}