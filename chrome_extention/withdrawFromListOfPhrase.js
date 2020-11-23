let btnIndex = 0
let withdrawCounter = 0
let startWithdraw = true
let lastScrollBtnIndex = 0
let trialMode = false
let example = false
let real = false
let scrolledInThisPage = false
let j = 0
let theNextBtn

function toTheNextPageWithdraw() {
    scrolledInThisPage = false
    let allPageButton = document.querySelectorAll('.artdeco-pagination__indicator.artdeco-pagination__indicator--number.ember-view')
    let thisPageButton = document.querySelector('.artdeco-pagination__indicator.artdeco-pagination__indicator--number.active.ember-view')
    let pageKey
    allPageButton.forEach((btn, key) => {
        if (btn === thisPageButton) {
            pageKey = key
        }
    })
    if (pageKey <= 0) {
        console.log('finish')
        backgroundConnection()
        return 'finish'
    } else {
        let nextPageBtn = allPageButton[pageKey - 1].querySelector('button')
        fakeClick(nextPageBtn)
    }
}

function createIndexToWithdraw() {
    let indexToWithdraw = []
    setTimeout(() => {
        let timesOnPage = document.querySelectorAll('.time-badge.time-ago')
        if (timesOnPage[99] || startWithdraw) {
            startWithdraw = false
            timesOnPage.forEach((phrase, key) => {
                let phraseText = phrase.innerText
                let phraseToClickOn
                REArray.forEach(RExp => {
                    let check = RegExp(RExp).test(phraseText)
                    if (check) phraseToClickOn = true
                })
                if (phraseToClickOn) {
                    indexToWithdraw.push(key)
                }
            })
            withdrawFromPeopleInPage(indexToWithdraw, 0)
        } else {
            createIndexToWithdraw()
        }
    }, 1000)
}

function withdrawFromPeopleInPage(indexToWithdraw, i) {
    let allWithdrawBtns = document.querySelectorAll('.invitation-card__action-btn')
    btnIndex = indexToWithdraw[i]
    let withdrawBtn = allWithdrawBtns[btnIndex]
    if(!real){
        i++
    } else {
        let orderWentUp = false
        REArray.forEach(RegE=>{
            let REToTest= RegExp(RegE)
          if(!REToTest.test(withdrawBtn)){
              orderWentUp = true
          }
        })
        if (!orderWentUp){
            i++
            btnIndex = indexToWithdraw[i]
         withdrawBtn = allWithdrawBtns[btnIndex]
        }
    }
    console.log(allWithdrawBtns)

    console.log(withdrawBtn)
    if (real && scrolledInThisPage){
        return hitTheWithdrawBtn(withdrawBtn, indexToWithdraw, i)
    } else if (btnIndex - lastScrollBtnIndex > 7) {
        scrolledInThisPage = true
        lastScrollBtnIndex = btnIndex
        scrollToTheButton(withdrawBtn, btnIndex, indexToWithdraw, i)
    } else {
        hitTheWithdrawBtn(withdrawBtn, indexToWithdraw, i)
    }
}

function scrollToTheButton(withdrawBtn, btnIndex, indexToWithdraw, i) {
    let heightLimit = document.documentElement.scrollHeight - window.innerHeight
    let currentTop = document.documentElement.scrollTop
    let btnTop = withdrawBtn.getBoundingClientRect().top - 100
    let needToScroll = btnTop + currentTop
    console.log('heightLimit', heightLimit)
    console.log('currentTop', currentTop)
    console.log('needToScroll', needToScroll)
    let partToScroll = 7
    let interval = setInterval(() => {
        scrollByPlus(partToScroll)
        if (document.documentElement.scrollTop >= needToScroll) {
            clearInterval(interval)
            // when it's not in real mode, there is a 'btnIndex' arg
            if (btnIndex){
                lastScrollBtnIndex = btnIndex
                hitTheWithdrawBtn(withdrawBtn, indexToWithdraw, i)
            } else {
                hitTheRealWithdrawBtn(withdrawBtn)
            }
        } else if (needToScroll > heightLimit) {
            needToScroll = heightLimit
        }
    }, 10)
}

function scrollByPlus(pxToScroll) {
    let currentTop = document.documentElement.scrollTop
    let needToScroll = currentTop + pxToScroll
    window.scroll(0, needToScroll)
}

function hitTheWithdrawBtn(withdrawBtn, indexToWithdraw, i) {
    let randomTimeToWithdraw = Math.random() * 1500 + 500
    if (!withdrawBtn) {
        return setValuesToNextPage()
    } else {
        withdrawCounter++
        console.log(withdrawCounter)
    }
    setTimeout(() => {
        if (trialMode) {
            withdrawBtn.style = 'background-color: aqua;'
            withdrawFromPeopleInPage(indexToWithdraw, i)
        } else if (example) {
            withdrawBtn.click()
            let acceptBtn = document.querySelector('.artdeco-modal__confirm-dialog-btn.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view')
            acceptBtn.click()
        }

    }, randomTimeToWithdraw)
}

function setValuesToNextPage() {
    toTheNextPageWithdraw()
    btnIndex = 0
    lastScrollBtnIndex = 0
    setTimeout(() => {
        createIndexToWithdraw()
    }, 2000)
}

chrome.runtime.onMessage.addListener(function (request) {
    if (request.text === 'withdraw_start') {
        REArray = request.chosenPhraseArray
        if (request.exeMode === 'trial'){
            trialMode = true
        }else if(request.exeMode === 'example'){
            example = true
        } else if (request.exeMode === 'real'){
            real = true
            withdrawForRealAlgorithm()
            return
        }
        createIndexToWithdraw()
    }
})


