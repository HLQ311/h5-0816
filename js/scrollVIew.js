(function($) {
    function debounce(func, wait = 30) {
        let timeout
        return function () {
            let context = this
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                func.apply(context, arguments)
            }, wait)
        }
    }
    function renderLoadingFunc() {
        return `<div style="height:32px;width: 100%;background: #fff;display: flex;justify-content: center;align-items: center" id="listLoading">
            <img src="img/loading.gif" alt="" style="width: 16px;height:16px">
        </div> `
    }
    const defaultProps = {
        renderLoading: renderLoadingFunc,
        onEndReachedThreshold: 50,
    }
    $.fn.scrollLoadMore = function(options) {
        const props = Object.assign({}, defaultProps, options)
        const { renderLoading, onEndReachedThreshold, listId, getNextPageData } = props
        const $list = $('#' + listId);
        let loading = false
        function changeLoadingStatus(isLoading) {
            loading = isLoading
            if (isLoading) {
                $list.append(renderLoading())
            } else {
                $('#listLoading').remove()
            }
        }
        function loadMore() {
            if (getNextPageData) {
                const appendFunc = data => {
                    $list.append(data)
                }
                getNextPageData(changeLoadingStatus, appendFunc)
            } else {
                console.error('必须传入fetchData函数')
            }
        }
        $(this).on('scroll', debounce(function() {
            const scrollTop = $(this).scrollTop();
            const scrollViewHeight = $list.height();
            const windowHeight = $(this).height();
            if(scrollTop + windowHeight >= scrollViewHeight - onEndReachedThreshold){
                // console.log('加载更多')
                if (!loading) {
                    changeLoadingStatus(true)
                    loadMore()
                }
            }
        }))
    }
})(jQuery)
