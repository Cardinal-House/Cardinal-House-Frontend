import { useState } from 'react';
import clsx from 'clsx';

import { 
    Grid, Typography, Button, InputBase, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    MenuItem, Checkbox, ListItemText, Menu, ButtonGroup, TableFooter, TablePagination, Box
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

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
    const [sortBy, setSortBy] = useState("Market Cap");
    const [tagMenuAnchor, setTagMenuAnchor] = useState(null);
    const [chainMenuAnchor, setChainMenuAnchor] = useState(null);
    const [sortMenuAnchor, setSortMenuAnchor] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);  

    const selectTag = (tag) => {
        if (tag == "All") {
            setTagsSelected([]);
        }
        else {
            const newTagsSelected = tagsSelected;
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
            const newChainsSelected = chainsSelected;
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
    
        return project.name.toLowerCase().includes(search.toLowerCase());
      }

      const categoryFilter = (project) => {
        if (categorySelected == "Tokens" && !project.category) {
            return true;
        }
        
        return categorySelected == project.category;
      }

      const projectSort = (project1, project2) => {
        if (sortBy == "Alphabetical") {
            return project1.name.localeCompare(project2.name);
        }
        else {
            const marketCap1 = project1.marketCap ? parseInt(project1.marketCap) : 0;
            const marketCap2 = project2.marketCap ? parseInt(project2.marketCap) : 0;
            return marketCap2 - marketCap1;
        }
      }

      const categoryChosen = (category) => {
        if (category == "Tokens") {
            setSortBy("Market Cap");
        }
        else {
            setSortBy("Alphabetical");
        }

        setCategorySelected(category);
      }

      const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      };      

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
                            <Button key={category} className={clsx(styles.projectCategoryBtn, categorySelected == category ? styles.selectedProjectCategoryBtn : "")}
                                onClick={() => categoryChosen(category)}>
                                {category}
                            </Button>
                        ))
                    }
                </ButtonGroup>

                <Button varian="contained" className={clsx(styles.tagBtn, tagsSelected.length == 0 ? styles.selectedTagBtn : "", styles.optionMargin)} 
                    onClick={(e) => setTagMenuAnchor(e.currentTarget)}>
                    &nbsp;&nbsp;Filter Tags <ArrowDropDownIcon/>
                </Button>  

                <Menu anchorEl={tagMenuAnchor} className={styles.filterDropdown} open={tagMenuOpen} onClose={() => setTagMenuAnchor(null)} PaperProps={{
                    style: {
                        maxHeight: 300
                    },
                }}>
                    <MenuItem key="Unselect All" onClick={() => selectTag("All")}>
                        <ListItemText style={{textAlign: 'center'}} primary="Unselect All" />
                    </MenuItem>                              
                    {props.tags && props.tags.map((tag) => (
                        <MenuItem key={tag} onClick={() => selectTag(tag)}>
                            <Checkbox checked={tagsSelected.includes(tag)}/>
                            <ListItemText primary={`${tag} (${props.tagCount[tag]})`} />
                        </MenuItem>
                    ))}               
                </Menu>     

                <Button varian="contained" className={clsx(styles.tagBtn, chainsSelected.length == 0 ? styles.selectedTagBtn : "", styles.optionMargin)} 
                    onClick={(e) => setChainMenuAnchor(e.currentTarget)}>
                    &nbsp;&nbsp;Filter Chains <ArrowDropDownIcon/>
                </Button>  

                <Menu anchorEl={chainMenuAnchor} className={styles.filterDropdown} open={chainsMenuOpen} onClose={() => setChainMenuAnchor(null)} PaperProps={{
                    style: {
                        maxHeight: 300
                    },
                }}>
                    <MenuItem key="Unselect All" onClick={() => selectChain("All")}>
                        <ListItemText style={{textAlign: 'center'}} primary="Unselect All" />
                    </MenuItem>                        
                    {props.chains && props.chains.map((chain) => (
                        <MenuItem key={chain} onClick={() => selectChain(chain)}>
                            <Checkbox checked={chainsSelected.includes(chain)}/>
                            <ListItemText primary={`${chain} (${props.chainCount[chain]})`} />
                        </MenuItem>
                    ))}             
                </Menu>                                             

                <Button varian="contained" className={clsx(styles.tagBtn, styles.optionMargin)} 
                    onClick={(e) => setSortMenuAnchor(e.currentTarget)}>
                    &nbsp;&nbsp;Sort by: {sortBy}<ArrowDropDownIcon/>
                </Button>  

                <Menu anchorEl={sortMenuAnchor} className={styles.filterDropdown} open={sortMenuOpen} onClose={() => setSortMenuAnchor(null)}>
                    {
                        categorySelected == "Tokens" && (
                            <MenuItem onClick={() => selectSort("Market Cap")}>
                                <ListItemText style={{textAlign: 'center'}} primary="Market Cap" />
                            </MenuItem>         
                        )
                    }                         
                    <MenuItem onClick={() => selectSort("Alphabetical")}>
                        <ListItemText style={{textAlign: 'center'}} primary="Alphabetical" />
                    </MenuItem>                                  
                </Menu>                                             

                <Paper component="form" className={clsx(styles.optionMargin, styles.search, styles.searchDesktop)} onSubmit={(e) => e.preventDefault()}>
                    <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Search..." value={search}
                        onChange={(e) => setSearch(e.target.value)} />
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
                                    <TableCell>Project</TableCell>
                                    <TableCell align="left">Networks</TableCell>
                                    <TableCell align="left">Market Cap</TableCell>
                                    <TableCell align="left">Tags</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
        
                                {
                                    projectsFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((project) => (
                                        <TableRow
                                        className={clsx(styles.projectTableRow, styles.projectTableRowHover)}
                                        onClick={() => {window.location.href = `${window.location.origin}/cryptoinsights/${project.id}`}}
                                        hover
                                        key={project.name}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                        <TableCell component="th" scope="row" className={styles.projectNameText}>
                                            <img alt="" src={project.logoUrl} width="50" height="50" style={{borderRadius: '50%'}} />
                                            &nbsp;&nbsp;&nbsp;{project.name}
                                        </TableCell>
                                        <TableCell align="left">{project.chains.replaceAll(",", ", ")}</TableCell>
                                        <TableCell align="left">{project.marketCap || project.marketCap == 0 ? "$" : "NA"}{project.marketCap?.toLocaleString()}</TableCell>
                                        <TableCell align="left">{project.tags.replaceAll(",", " | ")}</TableCell>
                                        </TableRow>
                                    ))
                                }
                                {emptyRows > 0 && (
                                    <TableRow style={{ height: 53 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
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
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>            
                    </Grid>
                )
            }

            {
                projectsFiltered.length == 0 && (
                    <Grid item xs={12} sm={6} md={4} lg={4} className="mt-5">
                        <Typography variant="h3" className={styles.darkText}>
                            No Projects Match Your Search
                        </Typography>
                    </Grid>
                )
            }     
        </>
    )
}