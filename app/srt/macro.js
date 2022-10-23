const macro = (function () {

    const supported = "https://etk.srail.kr/hpg/hra/01/selectScheduleList.do?pageId=TK0101010000";

    const statusManager = (function () {

        return {
            isRunning() {
                return sessionStorage.getItem('macro.status') === "on";
            },
            run() {
                sessionStorage.setItem("macro.status", "on");
            },
            stop() {
                sessionStorage.removeItem('macro.status');
            }
        }
    })();

    const configStore = (function () {

        const cache = JSON.parse(sessionStorage.getItem("macro.coach")) || [];

        return {
            has(id) {
                return cache.includes(id);
            },
            set(...seats) {
                sessionStorage.setItem("macro.coach", JSON.stringify(seats));
            },
            clear() {
                sessionStorage.removeItem('macro.coach');
            }
        };
    })();

    return {
        isSupported() {
            return document.URL.substring(0, supported.length) === supported;
        },
        isNotSupported() {
            return !this.isSupported();
        },
        isRunning() {
            return statusManager.isRunning();
        },
        createStarter() {
            helpers.createStarter(this.isRunning(), this.isRunning() ? macro.stop : macro.start);
        },
        isTarget(seatId) {
            return configStore.has(seatId);
        },
        start() {
            const seatIds = helpers.findTargetSeatIds();

            if (seatIds.length === 0) {
                alert("매크로를 실행하기 위해서는 예매하기 위한 열차 1개 이상을 선택하십시오.");
                return;
            }

            configStore.set(...seatIds);
            statusManager.run();

            location.reload();
        },
        stop() {
            alert("매크로를 중지합니다.");

            configStore.clear();
            statusManager.stop();

            location.reload();
        },
        got(seat) {
            configStore.clear();
            statusManager.stop();

            // bidding
            seat[0].click();
            chrome.runtime.sendMessage({type: 'success'});
        }
    }
})();

function prepare() {
    helpers.findTrains().forEach((train, idx) => helpers.createSelector(train, idx));
}

function search() {
    helpers.findTrains().forEach((train, idx) => {
        const [first, normal, waiting] = helpers.obtainSeats(train);

        if (macro.isTarget(idx + ":5")) helpers.markAsTargetSeat(first);
        if (macro.isTarget(idx + ":6")) helpers.markAsTargetSeat(normal);
        if (macro.isTarget(idx + ":7")) helpers.markAsTargetSeat(waiting);
    });

    const seats = helpers.findReservableSeat();

    if (seats.length === 0) {
        setTimeout(function () {
            location.reload();
        }, 100);
        return;
    }

    macro.got(seats);
}

// Run
(() => {
    if (macro.isNotSupported()) {
        return;
    }

    macro.createStarter();

    macro.isRunning()
        ? search()
        : prepare();
})();