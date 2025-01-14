grammar TriggerActions

entry Model:
    (triggers+=Trigger | actions+=Action)*;

Trigger:
    'trigger' name=ID;

Command:
    'nothing' | 'print' text=STRING;

Action:
    trigger=[Trigger:ID] 'does' command=Command;

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /[0-9]+/;
terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
