import { useState, useEffect } from 'react';
import clsx from 'clsx';

import { 
    Grid, Typography, Button, InputBase, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    MenuItem, Checkbox, ListItemText, Menu, ButtonGroup, TablePagination, Box, Hidden
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import styles from '../styles/EducationCenter.module.css';

function TablePaginationActions(props) {
    const { count, page, rowsPerPage, onPageChange } = props;
  
    const handleFirstPageButtonClick = (event) => {
      onPageChange(event, 0);
    };
  
    const handleBackButtonClick = (event) => {
      onPageChange(event, page - 1);
    };
  
    const handleNextButtonClick = (event) => {
      onPageChange(event, page + 1);
    };
  
    const handleLastPageButtonClick = (event) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };
  
    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          <FirstPageIcon />
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
        <KeyboardArrowLeft />
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          <KeyboardArrowRight />
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          <LastPageIcon />
        </IconButton>
      </Box>
    );
  }

export default function ProjectSearch(props) {
    const [categorySelected, setCategorySelected] = useState("Tokens");
    const [tagsSelected, setTagsSelected] = useState([]);
    const [chainsSelected, setChainsSelected] = useState([]);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("Market Cap - $$$ to $");
    const [tagMenuAnchor, setTagMenuAnchor] = useState(null);
    const [chainMenuAnchor, setChainMenuAnchor] = useState(null);
    const [sortMenuAnchor, setSortMenuAnchor] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);  

    useEffect(() => {
        const cachedRowsPerPage = localStorage.getItem("CardinalHouseProjectSearchRowsPerPage");

        if (cachedRowsPerPage) {
            setRowsPerPage(parseInt(cachedRowsPerPage));
        }
    }, [])

    const selectTag = (tag) => {
        if (tag == "All") {
            setTagsSelected([]);
        }
        else {
            let newTagsSelected = tagsSelected;
            if (tagsSelected.includes(tag)) {
                newTagsSelected = newTagsSelected.filter(t => t != tag);
            }
            else {
                newTagsSelected.push(tag);
            }
            setTagsSelected(JSON.parse(JSON.stringify(newTagsSelected)));
        }
      }

      const updateTagsSelected = (tagList) => {
        if (tagList.at(-1) == "All") {
            setTagsSelected([]);
        }
        else {
            setTagsSelected(tagList);
        }
      }      

    const selectChain = (chain) => {
        if (chain == "All") {
            setChainsSelected([]);
        }
        else {
            let newChainsSelected = JSON.parse(JSON.stringify(chainsSelected));
            if (chainsSelected.includes(chain)) {
                newChainsSelected = newChainsSelected.filter(c => c != chain);
            }
            else {
                newChainsSelected.push(chain);
            }
            setChainsSelected(JSON.parse(JSON.stringify(newChainsSelected)));
        }
      }

    const selectSort = (sortOption) => {
        setSortBy(sortOption);
        setSortMenuAnchor(null);
    }

      const updateChainsSelected = (chainList) => {
        if (chainList.at(-1) == "All") {
            setChainsSelected([]);
        }
        else {
            setChainsSelected(chainList);
        }
      }
    
      const tagFilter = (project) => {
        if (tagsSelected.length == 0) {
            return true;
        }
    
        const projectTags = project.tags.split(",");
        for (let i = 0; i < projectTags.length; i++) {
            if (tagsSelected.includes(projectTags[i])) {
                return true;
            }
        }
        
        return false;
      }
    
      const chainFilter = (project) => {
        if (chainsSelected.length == 0) {
            return true;
        }
    
        const projectChains = project.chains.split(",");
        for (let i = 0; i < projectChains.length; i++) {
            if (chainsSelected.includes(projectChains[i])) {
                return true;
            }
        }
        
        return false;
      }
    
      const searchFilter = (project) => {
        if (search == "") {
            return true;
        }
    
        return project.name.toLowerCase().includes(search.toLowerCase()) || project.tokenSymbol.toLowerCase().includes(search.toLowerCase());
      }

      const categoryFilter = (project) => {
        if (categorySelected == "Tokens" && !project.category) {
            return true;
        }
        
        return categorySelected == project.category;
      }

      const projectSort = (project1, project2) => {
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

      const categoryChosen = (category) => {
        if (category == "Tokens") {
            setSortBy("Market Cap - $$$ to $");
        }
        else {
            setSortBy("Alphabetical");
        }

        setCategorySelected(category);
      }

      const handleChangePage = (event, newPage) => {
        setPage(parseInt(newPage));
        console.log(newPage);
        console.log(rowsPerPage);
      };
    
      const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        localStorage.setItem("CardinalHouseProjectSearchRowsPerPage", newRowsPerPage);
        setPage(0);
      };     
      
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

    const updateSearch = (newSearch) => {
        setPage(0);
        setSearch(newSearch);
    }

    const projectsFiltered = props.projects ? props.projects.filter(categoryFilter).filter(tagFilter).filter(chainFilter).filter(searchFilter).sort(projectSort) : [];
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - projectsFiltered.length) : 0;  
    const tagMenuOpen = Boolean(tagMenuAnchor);
    const chainsMenuOpen = Boolean(chainMenuAnchor);
    const sortMenuOpen = Boolean(sortMenuAnchor);

    return (
        <>
            <Grid item lg={10} md={10} sm={12} xs={12}>
                <ButtonGroup variant="contained" className={clsx(styles.projectCategories, styles.optionMargin)}>
                    {
                        ["Tokens", "NFTs", "Businesses"].map((category) => (
                            <Button key={category} className={clsx(styles.projectCategoryBtn, categorySelected == category ? styles.selectedProjectCategoryBtn : "")} data-testid={`category-${category}`}
                                onClick={() => categoryChosen(category)}>
                                {category}
                            </Button>
                        ))
                    }
                </ButtonGroup>

                <Button varian="contained" className={clsx(styles.tagBtn, tagsSelected.length == 0 ? styles.selectedTagBtn : "", styles.optionMargin)} data-testid="tagFilterBtn"
                    onClick={(e) => setTagMenuAnchor(e.currentTarget)}>
                    &nbsp;&nbsp;Filter Tags <ArrowDropDownIcon/>
                </Button>  

                <Menu anchorEl={tagMenuAnchor} className={styles.filterDropdown} open={tagMenuOpen} onClose={() => setTagMenuAnchor(null)} PaperProps={{
                    style: {
                        maxHeight: 300
                    },
                }}>
                    <MenuItem key="Unselect All" onClick={() => selectTag("All")}>
                        <ListItemText style={{textAlign: 'center'}} primary="Unselect All" data-testid="unselect-all-tags" />
                    </MenuItem>                              
                    {props.tags && props.tags.map((tag) => (
                        <MenuItem key={tag} onClick={() => selectTag(tag)} data-testid={`tagOption-${tag}`}>
                            <Checkbox checked={tagsSelected.includes(tag)}/>
                            <ListItemText primary={`${tag} (${props.tagCount[tag]})`} />
                        </MenuItem>
                    ))}               
                </Menu>     

                <Button varian="contained" className={clsx(styles.tagBtn, chainsSelected.length == 0 ? styles.selectedTagBtn : "", styles.optionMargin)} data-testid="chainFilterBtn"
                    onClick={(e) => setChainMenuAnchor(e.currentTarget)}>
                    &nbsp;&nbsp;Filter Chains <ArrowDropDownIcon/>
                </Button>  

                <Menu anchorEl={chainMenuAnchor} className={styles.filterDropdown} open={chainsMenuOpen} onClose={() => setChainMenuAnchor(null)} PaperProps={{
                    style: {
                        maxHeight: 300
                    },
                }}>
                    <MenuItem key="Unselect All" onClick={() => selectChain("All")}>
                        <ListItemText style={{textAlign: 'center'}} primary="Unselect All" data-testid="unselect-all-chains" />
                    </MenuItem>                        
                    {props.chains && props.chains.map((chain) => (
                        <MenuItem key={chain} onClick={() => selectChain(chain)} data-testid={`chainOption-${chain}`}>
                            <Checkbox checked={chainsSelected.includes(chain)}/>
                            <ListItemText primary={`${chain} (${props.chainCount[chain]})`} />
                        </MenuItem>
                    ))}             
                </Menu>                                             

                <Button varian="contained" className={clsx(styles.tagBtn, styles.optionMargin)} data-testid="sortByBtn"
                    onClick={(e) => setSortMenuAnchor(e.currentTarget)}>
                    &nbsp;&nbsp;Sort by: {sortBy}<ArrowDropDownIcon/>
                </Button>  

                <Menu anchorEl={sortMenuAnchor} className={styles.filterDropdown} open={sortMenuOpen} onClose={() => setSortMenuAnchor(null)}>
                    {
                        categorySelected == "Tokens" && (
                            <MenuItem onClick={() => selectSort("Market Cap - $$$ to $")} data-testid="sortOption-Market Cap - $$$ to $">
                                <ListItemText style={{textAlign: 'center'}} primary="Market Cap - $$$ to $" />
                            </MenuItem>         
                        )
                    }                         
                    {
                        categorySelected == "Tokens" && (
                            <MenuItem onClick={() => selectSort("Market Cap - $ to $$$")} data-testid="sortOption-Market Cap - $ to $$$">
                                <ListItemText style={{textAlign: 'center'}} primary="Market Cap - $ to $$$" />
                            </MenuItem>         
                        )
                    }                         
                    <MenuItem onClick={() => selectSort("Alphabetical - A to Z")} data-testid="sortOption-Alphabetical - A to Z">
                        <ListItemText style={{textAlign: 'center'}} primary="Alphabetical - A to Z" />
                    </MenuItem>                                  
                    <MenuItem onClick={() => selectSort("Alphabetical - Z to A")} data-testid="sortOption-Alphabetical - Z to A">
                        <ListItemText style={{textAlign: 'center'}} primary="Alphabetical - Z to A" />
                    </MenuItem>                                  
                </Menu>                                             

                <Paper component="form" className={clsx(styles.optionMargin, styles.search, styles.searchDesktop)} onSubmit={(e) => e.preventDefault()}>
                    <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Search..." value={search}
                        onChange={(e) => updateSearch(e.target.value)} data-testid="project-search" />
                    <IconButton sx={{ p: '10px' }}>
                        <SearchIcon />
                    </IconButton>
                </Paper>   

                <div className={styles.searchMobile}>
                    <Paper component="form" className={clsx(styles.optionMargin, styles.search)} onSubmit={(e) => e.preventDefault()}>
                        <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Search..." value={search}
                            onChange={(e) => setSearch(e.target.value)} />
                        <IconButton sx={{ p: '10px' }}>
                            <SearchIcon />
                        </IconButton>
                    </Paper>   
                </div>                     
            </Grid>

            <Grid item xs={12}></Grid>

            {
                projectsFiltered.length > 0 && (
                    <Grid item xs={12}>
                        <TableContainer component={Paper} style={{ borderRadius: 18}}>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead>
                                <TableRow className={styles.projectTableRow}>
                                    <TableCell className={styles.marketCapNumber}>#</TableCell>
                                    <TableCell className={styles.sticky}>Project</TableCell>
                                    <TableCell align="left" className={styles.cellWidth}>Price&nbsp;&nbsp;&nbsp;</TableCell>
                                    <TableCell align="left" className={styles.cellWidth}>24h %</TableCell>
                                    <TableCell align="left">Networks</TableCell>
                                    <TableCell align="left">Market Cap</TableCell>
                                    <TableCell align="left">Tags</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
        
                                {
                                    projectsFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((project, index) => (
                                        <TableRow
                                        className={clsx(styles.projectTableRow, styles.projectTableRowHover)}
                                        onClick={() => {window.location.href = `${window.location.origin}/${project.id}`}}
                                        hover
                                        key={project.name}
                                        data-testid={`cryptoProject-${project.name}`}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                        <TableCell align="left" className={styles.marketCapNumber}>
                                            {sortBy == "Market Cap - $ to $$$" ? projectsFiltered.length - index : project.marketCapNumber}
                                        </TableCell>
                                        <TableCell className={clsx(styles.projectNameText, styles.sticky, styles.smallScreenCell)}>
                                            <Grid container justifyContent="center" alignItems="center">
                                                <Grid item lg={4} md={4} sm={4} xs={4}>
                                                    <img alt="" src={project.logoUrl} className={styles.projectLogo} />
                                                </Grid>
                                                <Grid item lg={8} md={8} sm={8} xs={8}>
                                                    {project.name}
                                                </Grid>
                                            </Grid>
                                        </TableCell>
                                        <TableCell className={clsx(styles.projectNameText, styles.sticky, styles.largeScreenCell)}>
                                            <img alt="" src={project.logoUrl} className={styles.projectLogo} />
                                            &nbsp;&nbsp;&nbsp;{project.name}
                                        </TableCell>
                                        <TableCell align="left" className={styles.cellWidth} data-testid={`${project.name}-tokenPrice`}>
                                            {project.tokenPrice ? `$${project.tokenPrice.toLocaleString(undefined, {minimumFractionDigits: computeMinimumFractionDigits(project.tokenPrice)})}` : ""}
                                        </TableCell>
                                        <TableCell align="left" className={styles.cellWidth}>
                                            {
                                                project.tokenPriceChangePercentage24hr != undefined && project.tokenPriceChangePercentage24hr >= 0 && (
                                                    <span className={styles.percentageText} style={{color: 'green'}} data-testid={`${project.name}-change24Hr`}>
                                                        <ArrowDropUpIcon/> 
                                                        {project.tokenPriceChangePercentage24hr?.toFixed(2)}%
                                                    </span>
                                                )
                                            }
                                            {
                                                project.tokenPriceChangePercentage24hr != undefined && project.tokenPriceChangePercentage24hr < 0 && (
                                                    <span className={styles.percentageText} style={{color: 'red'}} data-testid={`${project.name}-change24Hr`}>
                                                        <ArrowDropDownIcon/> 
                                                        {project.tokenPriceChangePercentage24hr?.toFixed(2) * -1}%
                                                    </span>
                                                )
                                            }
                                        </TableCell>
                                        <TableCell align="left" data-testid={`${project.name}-chains`}>
                                            {project.chains.replaceAll(",", ", ")}
                                        </TableCell>
                                        <TableCell align="left" data-testid={`${project.name}-marketCap`}>
                                            {project.marketCap || project.marketCap == 0 ? "$" : "NA"}{project.marketCap?.toLocaleString()}
                                            </TableCell>
                                        <TableCell align="left" data-testid={`${project.name}-tags`}>
                                            {project.tags.replaceAll(",", " | ")}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                                </TableBody>
                            </Table>
                        </TableContainer> 
                        <Hidden smDown>  
                            <TablePagination
                                rowsPerPageOptions={[10, 25, 50, 100, { label: 'All', value: -1 }]}
                                count={projectsFiltered.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                className={styles.tablePagination}
                                SelectProps={{
                                    inputProps: {
                                    'aria-label': 'rows per page',
                                    },
                                    native: true,
                                }}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                            />      
                        </Hidden>                           
                        <Hidden smUp>  
                            <TablePagination
                                rowsPerPageOptions={[]}
                                count={projectsFiltered.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                className={styles.tablePagination}
                                onPageChange={handleChangePage}
                                ActionsComponent={TablePaginationActions}
                            />      
                        </Hidden>                           
                    </Grid>
                )
            }

            {
                projectsFiltered.length == 0 && categorySelected == "Tokens" && (
                    <Grid item xs={12} sm={6} md={4} lg={4} className="mt-5">
                        <Typography variant="h3" className={styles.darkText}>
                            No Projects Match Your Search
                        </Typography>
                    </Grid>
                )
            }     
            {
                projectsFiltered.length == 0 && categorySelected != "Tokens" && (
                    <Grid item xs={12} sm={6} md={4} lg={4} className="mt-5">
                        <Typography variant="h3" className={styles.darkText}>
                            {categorySelected} Category Coming Soon!
                        </Typography>
                    </Grid>
                )
            }     
        </>
    )
}