export const docText = `step1:  su sunyb; click1 

step2:  smoke

step3:  cd smoke_test/SLB/   ### 进入要调试得模块目录

step4:  vi 0368010423.pl  ###修改脚本

step5:  vi test_list_smart  ### 把修改得脚本放进待执行，执行列表

        sunyb@console:~/sunyb.ws/src_apv/smoke_test/SLB$ cat test_list_smart
        | 110_111_112_113_115_116_117_118_119_120_121_122_123_124_125_180 | 200 | 0368010423.pl  |
        sunyb@console:~/sunyb.ws/src_apv/smoke_test/SLB$

step6:  smoke ### 退回执行目录

step7:  vi run_tmp.sh ## 编辑执行文件

        sunyb@console:~/sunyb.ws/src_apv$ cat run_tmp.sh
        sh run.sh -n mnet_env -e result/log/ -t smoke_test/SLB -f test_list_smart -p http://172.16.35.213/${1}
        sunyb@console:~/sunyb.ws/src_apv$

step8:  sh run_tmp.sh nodebug-Rel_APV-HG-U_10_4_2_27_2.click  ### 执行
`
