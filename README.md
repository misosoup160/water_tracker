# water_tracker
Track the amount of water you drank.

# install
`npm install water_tracker`
json file will be created in $HOME/.npm/water_tracker at startup.

# usage
`water_tracker [option]`

You can record the amount of water you drank.
The amount of water will be reset automatically the next day.
```
$ water_tracker
? 飲んだ水の量を入力してください(ml) 200
今日は200ml飲みました！
[||||----------------] 17% | 200/1200ml
```

Show how much you drank.
```
$ water_tracker -n
今日は200ml飲みました！
[||||----------------] 17% | 200/1200ml
```

Change the registered weight.
```
$ water_tracker -s
? あなたの体重を入力してください(kg) 55
体重を55kgで登録しました。
一日に飲む水の量の目安は1200mlです！
```

Reset the amount of water you drank.
```
$ water_tracker -r
飲んだ量をリセットしました！
```


