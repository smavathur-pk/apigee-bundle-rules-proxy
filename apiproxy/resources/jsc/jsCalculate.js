/*
  Copyright 2019 Google LLC

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      https://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

var appServerRoot = context.getVariable("AppServerRoot");
var appServerSfx = context.getVariable("AppServerSfx");
context.setVariable("target.url", "http://" + appServerRoot + "/" + appServerSuffix);

var myRequest = new Request("https://example.com","GET");
var exchange = httpClient.send(myRequest);
// Wait for the asynchronous GET request to finish
exchange.waitForComplete();

// Get and Process the response
if (exchange.isSuccess()) {
    var responseObj = exchange.getResponse().content.asJSON;
    return responseObj.access_token;
} else if (exchange.isError()) {
    throw new Error(exchange.getError());
}

var inputs = context.getVariable("numArray");
var nums = permutator(inputs);
var ops = combinator(3, ['+', '-', '*', '/']);
var candidates = [];
var answers = [];


fixme++;

//ops need to be expanded out to the permutations
var permutatedOps = [];
ops.forEach(function(op) {
    var addOps = [];
    var candOps = permutator(op);
    candOps.forEach(function(candOp) {
        var add = true;
        if (addOps.length > 0) {
            addOps.some(function(addOp) {
                if (addOp.join('') === candOp.join('')) {
                    add = false;
                    return;
                }
            });
            if (add) addOps.push(candOp);
        } else addOps.push(candOp);
    });
    monitor('permops');
    permutatedOps.push(addOps);
    monitor('permops');
});

//for each set of nums
//apply each of the ops sequences
//until we get a 24

nums.forEach(function(numArray) {
    permutatedOps.forEach(function(oopsArray) {
        oopsArray.forEach(function(opsArray) {
            //case 1: (a+b)*c/d
            //case 2: (a+b)*(c/d)
            //case 3: (a+b*c)/d
            //case 4: a+b*(c/d)
            //case 5: a+(b*c/d)
            //case 6: a+(b*c)/d
            //case 7: a+b*c/d

            candidates.push("(" + numArray[0] + opsArray[0] + numArray[1] + ")" + opsArray[1] + numArray[2] + opsArray[2] + numArray[3]);
            candidates.push("(" + numArray[0] + opsArray[0] + numArray[1] + ")" + opsArray[1] + "(" + numArray[2] + opsArray[2] + numArray[3] + ")");
            candidates.push("(" + numArray[0] + opsArray[0] + numArray[1] + opsArray[1] + numArray[2] + ")" + opsArray[2] + numArray[3]);
            candidates.push(numArray[0] + opsArray[0] + numArray[1] + opsArray[1] + "(" + numArray[2] + opsArray[2] + numArray[3] + ")");
            candidates.push(numArray[0] + opsArray[0] + "(" + numArray[1] + opsArray[1] + numArray[2] + opsArray[2] + numArray[3] + ")");
            candidates.push(numArray[0] + opsArray[0] + "(" + numArray[1] + opsArray[1] + numArray[2] + ")" + opsArray[2] + numArray[3]);
            candidates.push(numArray[0] + opsArray[0] + numArray[1] + opsArray[1] + numArray[2] + opsArray[2] + numArray[3]);
        });
    });
});

candidates.forEach(function(candidate) {
    var result = eval(candidate);
    if (result == 24) answers.push(candidate);
});

var result = {
    numbers: inputs,
    count: answers.length,
    answers: answers
};

context.setVariable("response.content", JSON.stringify(result));


function permutator(input) {
    var set = [];
    return permute(input);

    function permute(arr, data) {
        var cur, memo = data || [];
        if (!arr.splice) arr = arr.split(",");

        for (var i = 0; i < arr.length; i++) {
            cur = arr.splice(i, 1)[0];
            if (arr.length === 0) set.push(memo.concat([cur]));
            permute(arr.slice(), memo.concat([cur]));
            arr.splice(i, 0, cur);
        }
        return set;
    }
}

function uniquePermutator(input) {
    var set = [];
    return permute(input);

    function permute(arr, data) {
        var cur, memo = data || [];

        for (var i = 0; i < arr.length; i++) {
            cur = arr.splice(i, 1)[0];
            if (arr.length === 0) set.push(memo.concat([cur]));
            permute(arr.slice(), memo.concat([cur]));
            arr.splice(i, 0, cur);
        }
        return set;
    }
}

function combinator(n, from) {
    var set = [];
    pick(n, [], 0, from, set);
    return set;

    function pick(n, got, pos, from, result) {
        var cnt = 0;
        if (got.length == n) {
            result.push(got.join('').split(''));
            return 1;
        }
        for (var i = pos; i < from.length; i++) {
            got.push(from[i]);
            cnt += pick(n, got, i, from, result);
            got.pop();
        }
        return cnt;
    }
}
