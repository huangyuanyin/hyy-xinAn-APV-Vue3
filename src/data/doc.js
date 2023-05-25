export const docText = `step1:  su sunyb; click1 

step1:  su sunyb; click1 

step2:  smoke

step3:  cd smoke_test/SLB/   ### 进入要调试得模块目录，可创建个人专属调试模块

step4:  vi 0368010423.pl  ###修改脚本

step5:  cp test_list_smart test_list_debug #不重名即可
	vi test_list_debug  ### 创建临时执行列表文件，把修改得脚本放进待执行，执行列表，如下示例：
		
	   | 110_111_112_113_115_116_117_118_119_120_121_122_123_124_125_180 | 200 | 0368010423.pl  |
	
	!!!!且勿随意修改test_list_smart文件!!!!
    
step6:  smoke ### 退回执行目录

step7:  vi run_tmp.sh ## 创建自己的临时执行文件（且勿修改smart_开头的shell文件）
	  ## 临时执行文件格式参考如下：
	     sh run.sh -n mnet_env -e result/log/ -t smoke_test/SLB -f test_list_debug -p http://172.16.35.213/1
	  ## 可修改参数解释
	     smoke_test/SLB  # step3 调试得模块目录
	     test_list_debug # step5 修改过的执行列表

	  ## 示例如下：
             sunyb@console:~/sunyb.ws/src_apv$ cat run_tmp.sh 
             sh run.sh -n mnet_env -e result/log/ -t smoke_test/SLB -f test_list_debug -p http://172.16.35.213/1
             sunyb@console:~/sunyb.ws/src_apv$

step8:  sh run_tmp.sh nodebug-Rel_APV-HG-U_10_4_2_27_2.click  ### 执行
        ## 参数说明
        ## run_tmp.sh  step7 创建的临时执行文件
        ## nodebug-Rel_APV-HG-U_10_4_2_27_2.click 要测试的build名称，应与被测设备build（Rel_APV_HG_U_10_4_2_27_2）一致

step9:  查看调试结果
	  1,查看测试报告地址：http://10.4.0.200/cgi-bin/smoke_test_report.pl 选择对应build、模块、用例
	  2,查看调试日志：/home/sunyb/sunyb.ws/src_apv/result/log
		ls -alt | more  ## 根据时间查看
	  ## 示例如下：
	        sunyb@console:~/sunyb.ws/src_apv/result/log/2023-04-27-19:03:10--ArrayOS-Beta_APV_HG_K_10_4_3_3_20230424.array/smoke_test/result/mnet_env/T_0566$ ls
	        _1713010132.txt  shell-ttyS0.txt  shell-ttyS1.txt
	  ## T_0566 : 执行的第567个用例， 从零开始计数
          ##  _1713010132.txt 用例执行日志，1713010132 为用例1713010132.pl

`
