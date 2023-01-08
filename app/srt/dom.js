const helpers = (function () {

    const classOfTargetSeat = "__macro_target_seat";

    function obtainText(elem) {
        return elem.innerText.trim();
    }

    function excludeStanding() {
        return obtainText(this) === "예약하기";
    }

    function checkbox(id) {
        return '<label><input type="checkbox" class="__macro_checkbox" value="' + id + '"> 매크로</label>';
    }

    return {
        createStarter(isRunning, handler) {
            $('<a href="javascript:;" class="__macro_starter">' + (isRunning ? '정지' : '시작') + '</a>').on("click", handler).appendTo(".quickmenu");
        },
        createSelector(train, trainIdx) {
            this.obtainOpenSeats(train).forEach(seat => $(seat).append(checkbox(trainIdx + ":" + $(seat).index())));
        },
        findTrains() {
            return $("#search-list").find("tbody > tr").get();
        },
        // 모든 좌석
        obtainSeats(train) {
            const [, , , , , first, normal, waiting] = $(train).find("td");
            return [first, normal, waiting];
        },
        // 예약하기 버튼이 활성화된 좌석
        obtainOpenSeats(train) {
            return this.obtainSeats(train).filter(seat => $(seat).has("a").length > 0);
        },
        // 예약 목표 좌석으로 표시
        markAsTargetSeat(seat) {
            seat.classList.add(classOfTargetSeat);
        },
        // 예약 목표 좌석중에 예약가능한 좌석
        findReservableSeat() {
            return $("#search-list").find("." + classOfTargetSeat + " > a.btn_burgundy_dark").filter(excludeStanding).get();
        },
        // 예약 목표 좌석들의 ID
        findTargetSeatIds() {
            return $("#search-list").find(".__macro_checkbox:checked").get().map(({value}) => value);
        }
    }
})();