// 比賽結果
const CAR_FINAL_RESULT = [6, 1, 7, 2, 3, 5, 10, 8, 9, 4];
// 比賽過程時間
const RACING_TIME = 10000;
//比賽開始倒數時間
const RACING_START_TIME = 5000;
// 最後衝刺時間
const SPRINT_TIME = 3000;

const RED_LIGHT = 2000;
const YELLOW_LIGHT = 1000;
const GREEN_LIGHT = 0;

let requestAnimationFrameID = null;
let lastTimestamp = null;
let moveDistance = CAR_FINAL_RESULT.map(() => {
    return 0;
})
let lastRank = [];
let currentRank = [];


// onload
$(function () {
    // 開始倒數計時
    startTimer();
})

/**
 * 倒數計時
 */
const startTimer = () => {
    let tick = RACING_START_TIME;

    const timer = setInterval(() => {
        if (tick > 0) {
            const min = parseInt(tick / (60 * 1000));
            const sec = parseInt((tick - (min * 60 * 1000)) / 1000);
            const ms = parseInt((tick - (min * 60 * 1000)) % 1000);

            setTimerText({
                min,
                sec,
                ms
            });

            tick -= 10;

            if (tick <= RED_LIGHT) {
                $('.lightred').show();
            }
            if (tick <= YELLOW_LIGHT) {
                $('.lightred').show();
                $('.lightyellow').show();
            }
            if (tick <= GREEN_LIGHT) {
                $('.lightred').show();
                $('.lightyellow').show();
                $('.lightgreen').show();
            }
        } else {
            clearInterval(timer);
            $('.light').hide();
            setTimerText({
                min: 0,
                sec: 0,
                ms: 0
            })

            run();
        }
    }, 10);
}

/**
 * 設定秒數
 * @param {} param0 
 */
const setTimerText = ({
    min,
    sec,
    ms
}) => {
    $("#timerSec").html(padLeft(min, 2) + padLeft(sec, 2));
    $("#timerMS").html(padLeft(ms, 3));
}

/**
 * 開始比賽
 */
const run = () => {
    // 山背景
    $('.topbg').addClass("active");
    // 比賽線
    $('.animate-box').addClass("move-out");

    // $(".wave-stop").hide();
    // 船翹起&波浪
    $(".animate").addClass("active");

    let tick = RACING_TIME;
    let timer = null;

    const step = () => {
        lastRank.map((item, index) => {
            $("#" + item.key).removeClass("rank-" + (index + 1));
        })
        currentRank.map((item, index) => {
            $("#" + item.key).addClass("rank-" + (index + 1));
        })
        lastRank = currentRank;
        currentRank = [];
        if (tick <= 0) {
            let count = 0;
            // 終點線
            $('.animate-box').addClass("move-in");

            for (let i = 0; i < CAR_FINAL_RESULT.length; i++) {
                const num = CAR_FINAL_RESULT[i];
                const dom = $("#airship" + num);
                const pos = 38 * (CAR_FINAL_RESULT.length - i);

                currentRank.push({
                    key: "ball-" + num,
                    pos
                });
                currentRank.sort((a, b) => {
                    return b.pos - a.pos;
                })
                dom.animate({
                    fake: pos
                }, {
                    duration: 2000,
                    step: (now) => {
                        dom.css({
                            "transform": "translateX(" + (-now) + "%)"
                        })
                    },
                    complete: () => {
                        count++;

                        if (count >= CAR_FINAL_RESULT.length) {
                            lastRank.map((item, index) => {
                                $("#" + item.key).removeClass("rank-" + (index + 1));
                            })
                            currentRank.map((item, index) => {
                                $("#" + item.key).addClass("rank-" + (index + 1));
                            })
                            // $('.topbg').removeClass("active")
                            // $('.animate').removeClass("active")
                            // $(".wave-stop").show();

                            setTimeout(playResult, SPRINT_TIME);
                        }
                    }
                })
            }

            clearInterval(timer);
        } else {
            for (let i = 0; i < CAR_FINAL_RESULT.length; i++) {
                const dom = $("#airship" + (i + 1));
                const pos = parseInt(Math.random() * 380, 10);

                currentRank.push({
                    key: "ball-" + (i + 1),
                    pos
                });
                currentRank.sort((a, b) => {
                    return b.pos - a.pos;
                })

                dom.animate({
                    fake: pos,
                }, {
                    duration: 2000,
                    step: (now, fx) => {
                        console.log(fx)
                        dom.css({
                            "transform": "translateX(" + (-now) + "%)"
                        })
                    },
                    complete: () => {
                        console.log("============================", currentRank)
                    }
                })
            }
        }
        tick -= 2000;
    }

    step();

    timer = setInterval(step, 2000)
}

const playResult = () => {
    $('.rz-bg').css("opacity", "1");
    $('.animate').hide();

    for (let i = 0; i < 3; i++) {
        var num = CAR_FINAL_RESULT[i];
        $('.place').eq(i).addClass('PN_' + num)
    }
    $('.place1').css("transform", "translateX(0)");
    $('.place2').css("transform", "translateX(0)");
    $('.place3').css("transform", "translateX(0)");
    $(".rz-bg").addClass("open")
}



const padLeft = (str, len) => {
    if (str.toString().length >= len) {
        return str;
    } else {
        return padLeft("0" + str, len);
    }
}