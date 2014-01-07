/**
 * 文章列表
 */
define(function (require, exports, module) {
    var _ = require('_');

    var IndexController = ['$scope', '$routeParams', 'Blog', 'Flash', function ($scope, $routeParams, Blog, Flash) {

        $scope.STATUS = Blog.STATUS;
        //$scope.currStatus = Blog.getStatus($routeParams.status);

        // 根据页数获取 blog 列表
        $scope.getBlogs = function (page) {
            Blog.query({
                status: $routeParams.status,
                page: page
            }, function (data) {
                $scope.blogs = $scope.blogs.concat(data);
                $scope.page = data.$page;
                // 自动选中一篇，可能来自新建或修改页面
                if ($scope.blogs.length > 0 && !$scope.currBlog) {
                    var tmpId = Flash.tmp();
                    var blog = tmpId ? _.findWhere($scope.blogs, {id: tmpId}) : $scope.blogs[0];
                    $scope.showBlog(blog);
                }
            });
        };

        // 显示某一篇 blog 详情
        $scope.showBlog = function (blog) {
            $scope.currBlog = blog;
            blog.$get({detail: true});
        };

        // 删除 blog
        $scope.remove = function (blog) {
            Confirm.open('确定要删除“' + blog.title + '”？').then(function () {
                blog.$remove(function () {
                    $scope.blogs = _.without($scope.blogs, blog);
                    $scope.currBlog = $scope.blogs[0];
                });
            });
        };

        // scroll 到底部时载入下一页
        $scope.$watch('listScrollTop', function (value) {
            if (value >= 0.95 && $scope.page.hasNext) {
                $scope.getBlogs($scope.page.current + 1);
            }
        });

        $scope.blogs = [];
        $scope.getBlogs(1);
    }];

    IndexController.title = '文章列表';

    module.exports = IndexController;
});