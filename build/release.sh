#! /usr/bin/env sh

set -e                              # 告诉脚本 在任何命令出错的时候立即退出
echo "输入新发布的版本号码:"                  # 输入提示信息
read VERSION                        # 等到用户在终端输入 并输入的内容将复制给 VERSION
read -p "确认发布版本 $VERSION?(y/n)" -n1 # 输出信息并且让用户输入信息

# echo "\r\n================================ $VERSION $REPLY \r\n"
echo

# 判断是否
# if[] 直接判断 if[[]] 是正则的模糊判断
if [[ $REPLY = ~ ^[Yy]$]]; then
  echo "发布 $VERSION ...."

else
  echo "发布取消"
fi
