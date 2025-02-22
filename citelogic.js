function nullUndefined(input, error=true){
    if (input === null || input === undefined){
        if (error){
            throw Error
        } else {
            return ""
        }
    }
    return input
}
function lastNameFirstName(names, initial = false){
    nullUndefined(names, false)
    newNames = []
    if (names.length > 1){
        names.forEach(function(name){
            let listName = name.split(/\s+/);
            let lastName  = listName.pop();
            let firstName = listName.join(" ");
            if (initial) {
                if (!(firstName[0] === " ")){
                    firstName = firstName[0];
                }
                else {
                    firstName = firstName[1];
                }
            }
            newNames.push(" " + lastName + ", " + firstName)
            
        })
        return newNames;
    } 
    else {
        let listName = names[0].split(/\s+/);
        let lastName  = listName.pop();
        let firstName = listName.join(" ");
        if (initial){
            if (!(firstName[0] === " ")){
                firstName = firstName[0];
            }
            else {
                firstName = firstName[1];
            }
        }
        return lastName + ", " + firstName
    }
    
}
function getYear(date){
    if (Array.isArray(date)){
        date = date[0]
    }
    nullUndefined(date, false)
    let newDate = null
    if (date.includes('-')){
        newDate = date.split("-")
    }
    else if (date.includes("/")) {
        newDate = date.split("/");
    } 
    else {
        newDate = date;
    } 
    year = newDate[0]
    year = year.split(" ").join("")
    return year;
}

function sortTitle(title, website=false){
    nullUndefined(title, false)
    let newTitle = null;
    if (title.includes(" | ")) {
        newTitle = title.split(" | ");
    }
    else if (title.includes(" - ")){
        newTitle = title.split(" - "); 
    }
    else {
        newTitle = title;
    }
    if (website) {
        return newTitle[1];
    }
    else{
        return newTitle[0];
    }
}
//Property: "[property~=author][content]"
//Name: "meta[name='author']"
//returns an array
function sortItem (input, property) {
    var itemElements = document.querySelectorAll(input); 
    var items = [];
    itemElements.forEach(function(element) {
        let item = element.getAttribute("content");
        items.push(" " + item);
    });

    if (items.length != 0){
        return(items)
    }
    else{
        throw Error
    }

}
function sortScript(input){
    let script = document.querySelector('script[type="application/ld+json"]');
    var data = JSON.parse(script.textContent);
    if (Array.isArray(data)){
        relevantData = data[0]
    }
    else {
        relevantData = data;
    }
    if (input === "author"){
        var authors = relevantData.author;
        var authorNames = []
        authors.forEach(function(author) {
            if (author.name) {
                authorNames.push(author.name);
            }
        }); 
        return authorNames;
    }
    else if (input === "dateModified"){
        var dateModified = relevantData.dateModified
        return(dateModified)
    }
    else if (input === "datePublished"){
        var datePublished = relevantData.datePublished
        nullUndefined(datePublished)
        return(datePublished)
    }
    else if (input === "title") {
        var title = relevantData.headline;
        return title;

    }
}
function getJournal(){
    let journal = ""
    try{
        journal = sortItem('meta[name="citation_journal_title"]');
    } catch (e) {
        return ""
    }
    finally{
        journal = nullUndefined(journal, false)
        return journal;
    }
}
function getTitle(){
    try{
        var title = sortScript("title");
        nullUndefined(title)
    } catch (e){
        try{
            title = sortItem('citation_title')
        }catch (e){
            var title = document.title;
            title = sortTitle(title)
        }
    }
    finally{
        return title;
    }
}
function getIssue(){
    let issue = ""
    try {
        issue = sortItem("meta[name='citation_issue']")
        issue = issue[0].split(" ").join("")  
    } catch (e) {
        return ""
    }
    finally{
        
        return issue;
    }
}
function getPage(){
    let pageF = ''
    try{
        pageF = sortItem("meta[name='citation_firstpage']")
    } catch (e){
        return ""
    }
    finally{
        return pageF
    }
}
function getVolume(){
    let volume = ""
    try{
        volume = sortItem("meta[name='citation_volume']")
        
    } catch (e){
        return ""
    } finally {
        return volume
    }
}
function getDOI(){
    let doi = ""
    try{
        doi = sortItem("meta[name='citation_doi']")
        
    } catch (e){
        return ""
    } finally {
        return doi
    }
}

function citer() {
    let format = "APA"
    const getAuthor = () => {
        let author = null; 
        try {
            author = sortScript('author')
            if (author === undefined){
                throw Error
            }
        } catch (e) {
            
            try {
                author = sortItem("meta[name='author']", false);
            } catch(e) {
                try {
                    author = sortItem("meta[name='citation_author']", false);
                } catch(e){
                    try{
                        author = sortItem("[property~='article:author_name'][content]", true)
                    } catch(e) {
                        author = sortItem("meta[name='dc.Creator']", false)
                    }
                }
            }
        }finally {
            author = nullUndefined(author, false)
            return author;
        }
    
    }
    const getDatePublished = () => {
        let date = null;
        try {
            
            date = sortScript("datePublished");
        } catch (e) {
            try{
                date = sortItem("meta[name='citation_publication_date']", false);
            } catch (e) {
                date = sortItem("meta[name='dc.Date']", false)
            }
        } finally {
            date = nullUndefined(date, false)
            return date;
        }

    }
    const getPublisher = () => {
        let publisher = null;
        try {
            publisher = sortItem("meta[name='dc.Publisher']", false)
        } catch (e) {
            publisher = getTitle()
            publisher = sortTitle()
        } finally {
            publisher = nullUndefined(publisher, false)
            return publisher
        }

    }
    let authorName = getAuthor();
    let title = getTitle();
    let issue = getIssue();
    let volume = getVolume();
    let page = getPage();
    let publisher = getPublisher();
    //let journalDate = getjou();
    let journalTitle = getJournal();
    let datePublished = getDatePublished();
    let doi = getDOI();
    let citation = null;
    if (format === "APA"){
        authorName = lastNameFirstName(authorName, true);
        datePublished = getYear(datePublished); //TODO make it tell whether or not it is a journal or a website.
        citation =  `${authorName}. ${title}. (${datePublished}). <i>${journalTitle}</i>, <i>${volume}</i>(${issue}), ${page}. https://doi.org/${doi}`;
    }
    chrome.runtime.sendMessage({ 
        action: "sendInfo",
        data: citation 
    });
    return authorName;

}
if (document.readyState === 'complete') {
    citer();

} else {
    window.addEventListener('load', citer);
}
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'requestCiteLogic'){
        console.log("CITE LOGIC REQUESTED");
        citer();
    }
});